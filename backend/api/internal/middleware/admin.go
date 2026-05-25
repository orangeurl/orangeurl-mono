package middleware

import (
	"log"
	"os"
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
)

// AdminOnly enforces that the current Clerk user is in the ADMIN_USER_IDS
// allowlist (comma-separated Clerk user IDs in the environment). This is a
// defense-in-depth check on top of the DB `users.is_admin` flag enforced by
// AdminAuditLog / RequireAdmin: even if an attacker flipped the DB flag, they
// would still need to be in the env allowlist to access admin endpoints.
//
// MUST be chained AFTER RequireAuth() so the user has been loaded into context.
//
// If ADMIN_USER_IDS is empty or unset, this middleware fails closed (403) — an
// unconfigured allowlist must not silently expose admin routes.
func AdminOnly() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user, err := GetUserFromContext(c)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		allowed := adminAllowlist()
		if len(allowed) == 0 {
			log.Printf("[AdminOnly] ADMIN_USER_IDS is not configured; denying admin access for clerk_id=%s", user.ClerkID)
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Admin access is not configured on this server",
			})
		}

		if _, ok := allowed[user.ClerkID]; !ok {
			log.Printf("[AdminOnly] clerk_id=%s (email=%s) not in ADMIN_USER_IDS allowlist; denying %s %s",
				user.ClerkID, user.Email, c.Method(), c.Path())
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Forbidden - Admin access required",
			})
		}

		return c.Next()
	}
}

var (
	adminAllowlistOnce  sync.Once
	adminAllowlistCache map[string]struct{}
)

// adminAllowlist parses ADMIN_USER_IDS once at first use and caches the result.
// The cache is process-local; rotating admins requires a service restart, which
// is acceptable for an env-driven allowlist.
func adminAllowlist() map[string]struct{} {
	adminAllowlistOnce.Do(func() {
		raw := os.Getenv("ADMIN_USER_IDS")
		adminAllowlistCache = make(map[string]struct{})
		if raw == "" {
			return
		}
		for _, id := range strings.Split(raw, ",") {
			id = strings.TrimSpace(id)
			if id != "" {
				adminAllowlistCache[id] = struct{}{}
			}
		}
		log.Printf("[AdminOnly] Loaded %d admin user ID(s) from ADMIN_USER_IDS", len(adminAllowlistCache))
	})
	return adminAllowlistCache
}
