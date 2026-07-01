package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

// -- Notifications --

type CreateNotificationParams struct {
	UserID  uuid.UUID      `json:"user_id"`
	Type    string         `json:"type"`
	Title   string         `json:"title"`
	Message string         `json:"message"`
	ShortID sql.NullString `json:"short_id"`
}

const createNotification = `
INSERT INTO notifications (user_id, type, title, message, short_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, user_id, type, title, message, short_id, is_read, created_at
`

func (q *Queries) CreateNotification(ctx context.Context, arg CreateNotificationParams) (Notification, error) {
	row := q.db.QueryRowContext(ctx, createNotification,
		arg.UserID,
		arg.Type,
		arg.Title,
		arg.Message,
		arg.ShortID,
	)
	var i Notification
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Type,
		&i.Title,
		&i.Message,
		&i.ShortID,
		&i.IsRead,
		&i.CreatedAt,
	)
	return i, err
}

const listNotifications = `
SELECT id, user_id, type, title, message, short_id, is_read, created_at
FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2
`

func (q *Queries) ListNotifications(ctx context.Context, userID uuid.UUID, limit int32) ([]Notification, error) {
	rows, err := q.db.QueryContext(ctx, listNotifications, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Notification
	for rows.Next() {
		var i Notification
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Type,
			&i.Title,
			&i.Message,
			&i.ShortID,
			&i.IsRead,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const countUnreadNotifications = `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`

func (q *Queries) CountUnreadNotifications(ctx context.Context, userID uuid.UUID) (int64, error) {
	row := q.db.QueryRowContext(ctx, countUnreadNotifications, userID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

// MarkNotificationRead marks a single notification read, scoped to its owner.
const markNotificationRead = `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`

func (q *Queries) MarkNotificationRead(ctx context.Context, id, userID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, markNotificationRead, id, userID)
	return err
}

const markAllNotificationsRead = `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`

func (q *Queries) MarkAllNotificationsRead(ctx context.Context, userID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, markAllNotificationsRead, userID)
	return err
}

const deleteNotification = `DELETE FROM notifications WHERE id = $1 AND user_id = $2`

func (q *Queries) DeleteNotification(ctx context.Context, id, userID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteNotification, id, userID)
	return err
}
