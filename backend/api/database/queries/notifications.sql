-- name: CreateNotification :one
INSERT INTO notifications (user_id, type, title, message, short_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListNotifications :many
SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2;

-- name: CountUnreadNotifications :one
SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE;

-- name: MarkNotificationRead :exec
UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2;

-- name: MarkAllNotificationsRead :exec
UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE;

-- name: DeleteNotification :exec
DELETE FROM notifications WHERE id = $1 AND user_id = $2;
