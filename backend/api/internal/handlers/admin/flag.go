package admin

import (
	"database/sql"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/xenonnn4w/orangeurl/internal/database"
	"github.com/xenonnn4w/orangeurl/internal/middleware"
)

// InterstitialEnabledKey is the app_settings key for the global safety
// interstitial toggle. It is mirrored into Redis (client 0) for cheap reads on
// the hot redirect path.
const InterstitialEnabledKey = "interstitial_enabled"

// InterstitialRedisKey is the Redis cache key for the global toggle.
const InterstitialRedisKey = "settings:interstitial_enabled"

// FlagURLRequest is the body for flagging a URL.
type FlagURLRequest struct {
	ShortID    string `json:"short_id"`
	FlagReason string `json:"flag_reason"`
}

// FlaggedURLResponse represents a flagged URL in responses.
type FlaggedURLResponse struct {
	ID          string `json:"id"`
	ShortID     string `json:"short_id"`
	OriginalURL string `json:"original_url,omitempty"`
	FlagReason  string `json:"flag_reason"`
	FlaggedBy   string `json:"flagged_by,omitempty"`
	CreatedAt   string `json:"created_at"`
}

// requireAdmin resolves the current user and enforces admin access.
func requireAdmin(c *fiber.Ctx) (*database.User, error) {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return nil, c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}
	if !user.IsAdmin.Valid || !user.IsAdmin.Bool {
		return nil, c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Admin access required"})
	}
	return user, nil
}

// FlagURL marks a URL so visitors see a phishing/spam safety interstitial
// before being redirected to the destination. Only takes effect when the
// global interstitial toggle is enabled.
func FlagURL(c *fiber.Ctx) error {
	user, errResp := requireAdmin(c)
	if errResp != nil {
		return errResp
	}

	var req FlagURLRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	if req.ShortID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "short_id is required"})
	}
	if req.FlagReason == "" {
		req.FlagReason = "Potential phishing or spam"
	}

	// Grab the destination (if cached) purely for record keeping.
	redisClient := database.CreateClient(0)
	defer redisClient.Close()
	originalURL, _ := redisClient.Get(database.Ctx, req.ShortID).Result()

	queries := database.GetQueries()
	flagged, err := queries.FlagURL(c.Context(), database.FlagURLParams{
		ShortID:     req.ShortID,
		OriginalUrl: sql.NullString{String: originalURL, Valid: originalURL != ""},
		FlagReason:  req.FlagReason,
		FlaggedBy:   uuid.NullUUID{UUID: user.ID, Valid: true},
	})
	if err != nil {
		log.Printf("[FlagURL] Error flagging '%s': %v", req.ShortID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to flag URL"})
	}

	log.Printf("[FlagURL] ✅ Admin %s flagged URL '%s' - Reason: %s", user.Email, req.ShortID, req.FlagReason)

	// Notify the link owner in-app (best-effort; skip anonymous links).
	if urlRecord, uErr := queries.GetURLByShortID(c.Context(), req.ShortID); uErr == nil && urlRecord.UserID != uuid.Nil {
		_, nErr := queries.CreateNotification(c.Context(), database.CreateNotificationParams{
			UserID:  urlRecord.UserID,
			Type:    "url_flagged",
			Title:   "Your link was flagged",
			Message: "Your short link \"" + req.ShortID + "\" was flagged for review: " + req.FlagReason,
			ShortID: sql.NullString{String: req.ShortID, Valid: true},
		})
		if nErr != nil {
			log.Printf("[FlagURL] Warning: failed to create notification for owner: %v", nErr)
		}
	}

	return c.JSON(fiber.Map{
		"message":     "URL flagged successfully",
		"short_id":    flagged.ShortID,
		"flag_reason": flagged.FlagReason,
	})
}

// UnflagURL removes a URL's safety flag.
func UnflagURL(c *fiber.Ctx) error {
	user, errResp := requireAdmin(c)
	if errResp != nil {
		return errResp
	}

	shortID := c.Params("shortId")
	if shortID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "short_id is required"})
	}

	queries := database.GetQueries()
	if err := queries.UnflagURL(c.Context(), shortID); err != nil {
		log.Printf("[UnflagURL] Error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unflag URL"})
	}

	log.Printf("[UnflagURL] ✅ Admin %s unflagged URL '%s'", user.Email, shortID)

	return c.JSON(fiber.Map{"message": "URL unflagged successfully", "short_id": shortID})
}

// ListFlaggedURLs returns all flagged URLs for the admin view.
func ListFlaggedURLs(c *fiber.Ctx) error {
	if _, errResp := requireAdmin(c); errResp != nil {
		return errResp
	}

	queries := database.GetQueries()
	flagged, err := queries.ListFlaggedURLs(c.Context())
	if err != nil {
		log.Printf("[ListFlaggedURLs] Error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch flagged URLs"})
	}

	response := make([]FlaggedURLResponse, 0, len(flagged))
	shortIDs := make([]string, 0, len(flagged))
	for _, f := range flagged {
		item := FlaggedURLResponse{
			ID:         f.ID.String(),
			ShortID:    f.ShortID,
			FlagReason: f.FlagReason,
			CreatedAt:  f.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
		}
		if f.OriginalUrl.Valid {
			item.OriginalURL = f.OriginalUrl.String
		}
		if f.FlaggedBy.Valid {
			item.FlaggedBy = f.FlaggedBy.UUID.String()
		}
		response = append(response, item)
		shortIDs = append(shortIDs, f.ShortID)
	}

	return c.JSON(fiber.Map{
		"flagged_urls": response,
		"short_ids":    shortIDs,
		"count":        len(response),
	})
}

// GetInterstitialSetting returns the current global toggle state.
func GetInterstitialSetting(c *fiber.Ctx) error {
	if _, errResp := requireAdmin(c); errResp != nil {
		return errResp
	}

	queries := database.GetQueries()
	enabled := queries.GetBoolSetting(c.Context(), InterstitialEnabledKey, false)
	return c.JSON(fiber.Map{"enabled": enabled})
}

// SetInterstitialSetting flips the global toggle and mirrors it into Redis so
// the redirect hot path can read it without a DB round-trip.
func SetInterstitialSetting(c *fiber.Ctx) error {
	user, errResp := requireAdmin(c)
	if errResp != nil {
		return errResp
	}

	var req struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	value := "false"
	if req.Enabled {
		value = "true"
	}

	queries := database.GetQueries()
	if err := queries.SetSetting(c.Context(), InterstitialEnabledKey, value); err != nil {
		log.Printf("[SetInterstitialSetting] Error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update setting"})
	}

	// Mirror into Redis for the resolve hot path (best-effort).
	redisClient := database.CreateClient(0)
	defer redisClient.Close()
	_ = redisClient.Set(database.Ctx, InterstitialRedisKey, value, 0).Err()

	log.Printf("[SetInterstitialSetting] ✅ Admin %s set safety interstitial enabled=%v", user.Email, req.Enabled)

	return c.JSON(fiber.Map{"message": "Setting updated", "enabled": req.Enabled})
}
