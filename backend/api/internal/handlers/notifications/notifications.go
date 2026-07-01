package notifications

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/xenonnn4w/orangeurl/internal/database"
	"github.com/xenonnn4w/orangeurl/internal/middleware"
)

// defaultLimit caps how many notifications the panel loads at once.
const defaultLimit = 30

type notificationResponse struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	ShortID   string `json:"short_id,omitempty"`
	IsRead    bool   `json:"is_read"`
	CreatedAt string `json:"created_at"`
}

// List returns the current user's notifications (newest first).
func List(c *fiber.Ctx) error {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	queries := database.GetQueries()
	items, err := queries.ListNotifications(c.Context(), user.ID, defaultLimit)
	if err != nil {
		log.Printf("[Notifications.List] Error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch notifications"})
	}

	resp := make([]notificationResponse, 0, len(items))
	for _, n := range items {
		item := notificationResponse{
			ID:        n.ID.String(),
			Type:      n.Type,
			Title:     n.Title,
			Message:   n.Message,
			IsRead:    n.IsRead,
			CreatedAt: n.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
		}
		if n.ShortID.Valid {
			item.ShortID = n.ShortID.String
		}
		resp = append(resp, item)
	}

	unread, _ := queries.CountUnreadNotifications(c.Context(), user.ID)

	return c.JSON(fiber.Map{
		"notifications": resp,
		"unread_count":  unread,
	})
}

// UnreadCount returns just the unread badge count (cheap polling endpoint).
func UnreadCount(c *fiber.Ctx) error {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	queries := database.GetQueries()
	unread, err := queries.CountUnreadNotifications(c.Context(), user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to count notifications"})
	}
	return c.JSON(fiber.Map{"unread_count": unread})
}

// MarkRead marks one notification read.
func MarkRead(c *fiber.Ctx) error {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid notification ID"})
	}

	queries := database.GetQueries()
	if err := queries.MarkNotificationRead(c.Context(), id, user.ID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update notification"})
	}
	return c.JSON(fiber.Map{"message": "ok"})
}

// MarkAllRead clears the unread badge.
func MarkAllRead(c *fiber.Ctx) error {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	queries := database.GetQueries()
	if err := queries.MarkAllNotificationsRead(c.Context(), user.ID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update notifications"})
	}
	return c.JSON(fiber.Map{"message": "ok"})
}

// Delete removes a single notification.
func Delete(c *fiber.Ctx) error {
	user, err := middleware.GetUserFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid notification ID"})
	}

	queries := database.GetQueries()
	if err := queries.DeleteNotification(c.Context(), id, user.ID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete notification"})
	}
	return c.JSON(fiber.Map{"message": "ok"})
}
