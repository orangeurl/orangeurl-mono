package routes

import (
	"context"
	"database/sql"
	"html"
	"log"
	"net"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/oschwald/geoip2-golang"
	"github.com/sqlc-dev/pqtype"
	"github.com/xenonnn4w/orangeurl/internal/database"
	webhookService "github.com/xenonnn4w/orangeurl/internal/services/webhooks"
)

var (
	geoIPReader *geoip2.Reader
	geoIPOnce   sync.Once
)

// initGeoIP initializes the GeoIP2 reader (called once)
func initGeoIP() {
	geoIPOnce.Do(func() {
		dbPath := os.Getenv("GEOIP_DB_PATH")
		if dbPath == "" {
			dbPath = "/usr/share/GeoIP/GeoLite2-City.mmdb" // Default path
		}

		reader, err := geoip2.Open(dbPath)
		if err != nil {
			log.Printf("[GeoIP] Failed to open GeoIP database at %s: %v (city lookup will be disabled)", dbPath, err)
			return
		}

		geoIPReader = reader
		log.Printf("[GeoIP] Successfully loaded GeoIP database from %s", dbPath)
	})
}

// GeoData holds geographic information from IP lookup
type GeoData struct {
	Country string
	City    string
}

// getGeoFromIP looks up geographic information from IP address using GeoIP2
func getGeoFromIP(ipAddress string) GeoData {
	result := GeoData{}

	// Initialize GeoIP reader if not already done
	initGeoIP()

	if geoIPReader == nil {
		return result // GeoIP database not available
	}

	ip := net.ParseIP(ipAddress)
	if ip == nil {
		return result
	}

	record, err := geoIPReader.City(ip)
	if err != nil {
		return result
	}

	// Extract country code (ISO format like "US", "GB", "CA")
	if record.Country.IsoCode != "" {
		result.Country = record.Country.IsoCode
	}

	// Extract city name in English
	if record.City.Names != nil {
		if cityName, ok := record.City.Names["en"]; ok {
			result.City = cityName
		}
	}

	return result
}

// Simple user-agent parser helpers
func parseDeviceType(ua string) string {
	ua = strings.ToLower(ua)
	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		return "mobile"
	} else if strings.Contains(ua, "tablet") || strings.Contains(ua, "ipad") {
		return "tablet"
	}
	return "desktop"
}

func parseBrowser(ua string) string {
	ua = strings.ToLower(ua)
	if strings.Contains(ua, "edg") {
		return "Edge"
	} else if strings.Contains(ua, "chrome") {
		return "Chrome"
	} else if strings.Contains(ua, "firefox") {
		return "Firefox"
	} else if strings.Contains(ua, "safari") {
		return "Safari"
	}
	return "Other"
}

func parseOS(ua string) string {
	ua = strings.ToLower(ua)
	if strings.Contains(ua, "windows") {
		return "Windows"
	} else if strings.Contains(ua, "mac") || strings.Contains(ua, "darwin") {
		return "macOS"
	} else if strings.Contains(ua, "linux") {
		return "Linux"
	} else if strings.Contains(ua, "android") {
		return "Android"
	} else if strings.Contains(ua, "iphone") || strings.Contains(ua, "ipad") {
		return "iOS"
	}
	return "Other"
}

func isBot(ua string) bool {
	ua = strings.ToLower(ua)
	botKeywords := []string{"bot", "crawler", "spider", "scraper", "curl", "wget"}
	for _, keyword := range botKeywords {
		if strings.Contains(ua, keyword) {
			return true
		}
	}
	return false
}

func parseReferrerSource(referer string) string {
	if referer == "" {
		return "Direct"
	}

	ref := strings.ToLower(referer)

	if strings.Contains(ref, "youtube.com") || strings.Contains(ref, "youtu.be") {
		return "YouTube"
	} else if strings.Contains(ref, "twitter.com") || strings.Contains(ref, "x.com") {
		return "X"
	} else if strings.Contains(ref, "instagram.com") {
		return "Instagram"
	} else if strings.Contains(ref, "linkedin.com") {
		return "LinkedIn"
	} else if strings.Contains(ref, "medium.com") {
		return "Medium"
	} else if strings.Contains(ref, "facebook.com") || strings.Contains(ref, "fb.com") {
		return "Facebook"
	} else if strings.Contains(ref, "reddit.com") {
		return "Reddit"
	} else if strings.Contains(ref, "tiktok.com") {
		return "TikTok"
	} else if strings.Contains(ref, "t.me") || strings.Contains(ref, "telegram.org") {
		return "Telegram"
	} else if strings.Contains(ref, "discord.com") || strings.Contains(ref, "discord.gg") {
		return "Discord"
	} else if strings.Contains(ref, "google.com") || strings.Contains(ref, "google.") {
		return "Google"
	}

	return "Other"
}

// extractCountryFromHeaders tries to extract country code from common CDN/proxy headers
func extractCountryFromHeaders(c *fiber.Ctx) string {
	// Check for Cloudflare country header
	if country := c.Get("CF-IPCountry"); country != "" {
		return country
	}
	
	// Check for other common geo headers
	if country := c.Get("X-Country-Code"); country != "" {
		return country
	}
	
	if country := c.Get("x-rg-country"); country != "" {
		return country
	}
	
	if country := c.Get("x-forwarded-country"); country != "" {
		return country
	}
	
	// Fastly geo header
	if country := c.Get("Fastly-Geo-Country"); country != "" {
		return country
	}
	
	return ""
}

func ResolveURL(c *fiber.Ctx) error {
	url := c.Params("url")

	// First, check if this URL is blocked (abuse reports, etc.)
	queries := database.GetQueries()
	isBlocked, _ := queries.IsURLBlocked(c.Context(), url)
	if isBlocked {
		log.Printf("[ResolveURL] ⛔ Blocked URL access attempt: %s", url)
		c.Status(403)
		return c.Type("html").SendString(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="refresh" content="0;url=https://app.orangeurl.live/broken-link">
				<title>Link Blocked</title>
			</head>
			<body>
				<p>This link has been blocked due to abuse. Redirecting...</p>
				<script>window.location.href='https://app.orangeurl.live/broken-link';</script>
			</body>
			</html>
		`)
	}

	r := database.CreateClient(0)
	defer r.Close()

	value, err := r.Get(database.Ctx, url).Result()
	if err == redis.Nil {
		// Cache miss — Postgres is the source of truth.
		urlRecord, pgErr := queries.GetURLByShortID(c.Context(), url)
		if pgErr != nil {
			c.Status(404)
			return c.Type("html").SendString(`
				<!DOCTYPE html>
				<html>
				<head>
					<meta http-equiv="refresh" content="0;url=https://app.orangeurl.live/broken-link">
					<title>Link Not Found</title>
				</head>
				<body>
					<p>Redirecting to error page...</p>
					<script>window.location.href='https://app.orangeurl.live/broken-link';</script>
				</body>
				</html>
			`)
		}
		value = urlRecord.OriginalUrl
		// Repopulate cache so subsequent hits skip the DB roundtrip.
		ttl := time.Duration(0)
		if urlRecord.Expiry.Valid {
			if remaining := time.Until(urlRecord.Expiry.Time); remaining > 0 {
				ttl = remaining
			}
		}
		_ = r.Set(database.Ctx, url, value, ttl).Err()
	} else if err != nil {
		// Return 500 with HTML that redirects for database errors
		c.Status(500)
		return c.Type("html").SendString(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="refresh" content="0;url=https://app.orangeurl.live/broken-link">
				<title>Server Error</title>
			</head>
			<body>
				<p>Redirecting to error page...</p>
				<script>window.location.href='https://app.orangeurl.live/broken-link';</script>
			</body>
			</html>
		`)
	}

	rInr := database.CreateClient(1)
	defer rInr.Close()

	_ = rInr.Incr(database.Ctx, "counter")

	// Track analytics in Postgres if URL exists in database
	urlRecord, pgErr := queries.GetURLByShortID(c.Context(), url)
	if pgErr == nil {
		// URL found in Postgres, track the click
		userAgent := c.Get("User-Agent")
		referer := c.Get("Referer")
		ipAddress := c.IP()

		// Extract the first IP if multiple IPs are present (X-Forwarded-For can have multiple IPs)
		// Format: "client_ip, proxy1_ip, proxy2_ip"
		if idx := strings.Index(ipAddress, ","); idx != -1 {
			ipAddress = strings.TrimSpace(ipAddress[:idx])
		}

		// Parse user agent data
		deviceType := parseDeviceType(userAgent)
		browser := parseBrowser(userAgent)
		osName := parseOS(userAgent)
		botDetected := isBot(userAgent)

		// Try to get country from common headers set by CDNs/proxies
		country := extractCountryFromHeaders(c)
		city := ""

		// If no country from headers, or to get city, use GeoIP lookup
		if country == "" {
			geoData := getGeoFromIP(ipAddress)
			country = geoData.Country
			city = geoData.City
		} else {
			// We have country from headers, but still want city from GeoIP
			geoData := getGeoFromIP(ipAddress)
			city = geoData.City
		}

		// Create click record
		// Parse IP address using net package
		ipAddr := pqtype.Inet{Valid: false}
		if parsedIP := net.ParseIP(ipAddress); parsedIP != nil {
			// Create IPNet with the parsed IP and appropriate mask
			var ipNet net.IPNet
			if parsedIP.To4() != nil {
				// IPv4
				ipNet = net.IPNet{IP: parsedIP, Mask: net.CIDRMask(32, 32)}
			} else {
				// IPv6
				ipNet = net.IPNet{IP: parsedIP, Mask: net.CIDRMask(128, 128)}
			}
			ipAddr = pqtype.Inet{IPNet: ipNet, Valid: true}
		}

		_, _ = queries.CreateClick(c.Context(), database.CreateClickParams{
			UrlID:      urlRecord.ID,
			IpAddress:  ipAddr,
			UserAgent:  sql.NullString{String: userAgent, Valid: userAgent != ""},
			Referer:    sql.NullString{String: referer, Valid: referer != ""},
			Country:    sql.NullString{String: country, Valid: country != ""},
			City:       sql.NullString{String: city, Valid: city != ""},
			DeviceType: sql.NullString{String: deviceType, Valid: true},
			Browser:    sql.NullString{String: browser, Valid: true},
			Os:         sql.NullString{String: osName, Valid: true},
			IsBot:      sql.NullBool{Bool: botDetected, Valid: true},
		})

		// Trigger webhook for url.clicked event
		host := os.Getenv("DOMAIN")
		if host == "" {
			host = os.Getenv("PUBLIC_HOST")
		}
		if !strings.HasPrefix(host, "http://") && !strings.HasPrefix(host, "https://") {
			host = "https://" + host
		}
		shortURL := host + "/" + url

		referrerSource := parseReferrerSource(referer)

		webhookService.TriggerWebhook("url.clicked", urlRecord.UserID, map[string]interface{}{
			"short_url":      shortURL,
			"short_id":       url,
			"long_url":       value,
			"clicked_at":     time.Now().UTC().Format(time.RFC3339),
			"referer":        referer,
			"referer_source": referrerSource,
			"country":        country,
			"city":           city,
			"device_type":    deviceType,
			"browser":        browser,
			"os":             osName,
			"is_bot":         botDetected,
		})
		log.Printf("[ResolveURL] Webhook triggered for url.clicked: %s", shortURL)
	}

	// Safety interstitial: when the global toggle is enabled and this specific
	// short link has been flagged by an admin, show a warning + branding page
	// with a manual "Continue" button instead of redirecting immediately.
	if interstitialEnabled(r, queries, c.Context()) {
		if flagged, _ := queries.IsURLFlagged(c.Context(), url); flagged {
			reason := "This link has been flagged as potentially unsafe."
			if f, ferr := queries.GetFlaggedURL(c.Context(), url); ferr == nil && f.FlagReason != "" {
				reason = f.FlagReason
			}
			c.Status(fiber.StatusOK)
			return c.Type("html").SendString(renderInterstitial(value, reason))
		}
	}

	return c.Redirect(value, 301)
}

// interstitialRedisKey mirrors admin.InterstitialRedisKey; duplicated here to
// avoid a routes -> handlers import cycle.
const interstitialRedisKey = "settings:interstitial_enabled"
const interstitialSettingKey = "interstitial_enabled"

// interstitialEnabled reads the global safety-interstitial toggle. It checks
// Redis first (populated by the admin handler) and falls back to Postgres,
// repopulating the cache on a miss. Defaults to disabled on any error so the
// redirect hot path never breaks.
func interstitialEnabled(r *redis.Client, queries *database.Queries, ctx context.Context) bool {
	if val, err := r.Get(database.Ctx, interstitialRedisKey).Result(); err == nil {
		return val == "true"
	}
	enabled := queries.GetBoolSetting(ctx, interstitialSettingKey, false)
	cached := "false"
	if enabled {
		cached = "true"
	}
	_ = r.Set(database.Ctx, interstitialRedisKey, cached, 0).Err()
	return enabled
}

// renderInterstitial returns a self-contained, brand-styled warning page shown
// before redirecting a flagged link. destination is the final URL; reason is
// the admin-supplied flag reason.
func renderInterstitial(destination, reason string) string {
	safeDest := html.EscapeString(destination)
	safeReason := html.EscapeString(reason)
	displayDest := safeDest
	if len(displayDest) > 90 {
		displayDest = displayDest[:90] + "…"
	}

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Safety check · OrangeURL</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  /* Brand tokens mirrored from the web app (globals.css) */
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14% 12%;
    --card: 0 0% 100%;
    --muted: 24 20% 96%;
    --muted-foreground: 24 10% 45%;
    --primary: 24 94% 55%;
    --primary-dark: 24 94% 45%;
    --border: 24 20% 90%;
    --radius: 0.75rem;
    --destructive: 0 84% 60%;
    --destructive-soft: 0 86% 97%;
    --destructive-border: 0 90% 92%;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --background: 0 0% 6%;
      --foreground: 0 0% 97%;
      --card: 0 0% 10%;
      --muted: 0 0% 15%;
      --muted-foreground: 0 0% 60%;
      --border: 0 0% 20%;
      --destructive-soft: 0 40% 14%;
      --destructive-border: 0 45% 25%;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; line-height: 1.5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: hsl(var(--foreground));
    background:
      radial-gradient(1200px 600px at 50% -10%, hsl(var(--primary) / 0.14), transparent 60%),
      hsl(var(--background));
  }
  .card {
    background: hsl(var(--card)); width: 100%; max-width: 480px;
    border: 1px solid hsl(var(--border)); border-radius: calc(var(--radius) + 4px);
    padding: 36px 32px; text-align: center;
    box-shadow: 0 24px 60px -20px hsl(24 60% 30% / 0.20), 0 4px 12px hsl(0 0% 0% / 0.04);
  }
  .brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .brand .mark {
    width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, #f97316 50%, #fb923c 100%);
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.4);
  }
  .brand .name {
    font-weight: 800; font-size: 19px; letter-spacing: -0.01em;
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, #fb923c 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .warn-icon {
    width: 68px; height: 68px; margin: 0 auto 18px; border-radius: 50%;
    background: hsl(var(--destructive-soft)); border: 1px solid hsl(var(--destructive-border));
    display: flex; align-items: center; justify-content: center;
  }
  h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 14px; }
  .reason {
    background: hsl(var(--destructive-soft)); border: 1px solid hsl(var(--destructive-border));
    color: hsl(var(--destructive)); border-radius: var(--radius);
    padding: 12px 16px; font-size: 14px; font-weight: 500; margin: 0 0 18px;
  }
  .dest {
    font-size: 13px; color: hsl(var(--muted-foreground));
    background: hsl(var(--muted)); border: 1px solid hsl(var(--border));
    border-radius: var(--radius); padding: 12px 14px; margin: 0 0 26px; text-align: left;
  }
  .dest .label { display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  .dest .url { font-family: 'JetBrains Mono', ui-monospace, monospace; color: hsl(var(--foreground)); word-break: break-all; font-size: 13px; }
  .btn {
    display: block; width: 100%; padding: 13px 20px; border-radius: var(--radius);
    font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer; border: none;
    font-family: inherit; transition: all .15s ease;
  }
  .btn-primary {
    color: #fff; margin-bottom: 8px;
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%);
    box-shadow: 0 6px 16px hsl(var(--primary) / 0.35);
  }
  .btn-primary:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: hsl(var(--muted-foreground)); padding: 10px; }
  .btn-secondary:hover { color: hsl(var(--foreground)); }
  .promo {
    margin-top: 24px; padding-top: 20px; border-top: 1px solid hsl(var(--border));
    font-size: 13px; color: hsl(var(--muted-foreground));
  }
  .promo a { color: hsl(var(--primary-dark)); font-weight: 600; text-decoration: none; }
  .promo a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <main class="card">
    <div class="brand">
      <span class="mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </span>
      <span class="name">OrangeURL</span>
    </div>
    <div class="warn-icon">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="hsl(0 84% 60%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>
    <h1>Heads up &mdash; this link may be unsafe</h1>
    <div class="reason">` + safeReason + `</div>
    <div class="dest">
      <span class="label">You are about to visit</span>
      <span class="url">` + displayDest + `</span>
    </div>
    <a class="btn btn-primary" href="` + safeDest + `" rel="noopener noreferrer nofollow">Continue to site</a>
    <a class="btn btn-secondary" href="https://orangeurl.live">No thanks, take me back</a>
    <div class="promo">
      Protected by <a href="https://orangeurl.live">OrangeURL</a> &mdash; create short links, QR codes &amp; landing pages that people can trust.
    </div>
  </main>
</body>
</html>`
}

