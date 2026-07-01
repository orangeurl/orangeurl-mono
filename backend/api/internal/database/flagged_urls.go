package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

// -- Flagged URLs (safety interstitial) --

type FlagURLParams struct {
	ShortID     string         `json:"short_id"`
	OriginalUrl sql.NullString `json:"original_url"`
	FlagReason  string         `json:"flag_reason"`
	FlaggedBy   uuid.NullUUID  `json:"flagged_by"`
}

const flagURL = `
INSERT INTO flagged_urls (short_id, original_url, flag_reason, flagged_by)
VALUES ($1, $2, $3, $4)
ON CONFLICT (short_id) DO UPDATE SET
    flag_reason = EXCLUDED.flag_reason,
    flagged_by = EXCLUDED.flagged_by,
    created_at = NOW()
RETURNING id, short_id, original_url, flag_reason, flagged_by, created_at
`

func (q *Queries) FlagURL(ctx context.Context, arg FlagURLParams) (FlaggedUrl, error) {
	row := q.db.QueryRowContext(ctx, flagURL,
		arg.ShortID,
		arg.OriginalUrl,
		arg.FlagReason,
		arg.FlaggedBy,
	)
	var i FlaggedUrl
	err := row.Scan(
		&i.ID,
		&i.ShortID,
		&i.OriginalUrl,
		&i.FlagReason,
		&i.FlaggedBy,
		&i.CreatedAt,
	)
	return i, err
}

const unflagURL = `DELETE FROM flagged_urls WHERE short_id = $1`

func (q *Queries) UnflagURL(ctx context.Context, shortID string) error {
	_, err := q.db.ExecContext(ctx, unflagURL, shortID)
	return err
}

const isURLFlagged = `SELECT EXISTS(SELECT 1 FROM flagged_urls WHERE short_id = $1)`

func (q *Queries) IsURLFlagged(ctx context.Context, shortID string) (bool, error) {
	row := q.db.QueryRowContext(ctx, isURLFlagged, shortID)
	var flagged bool
	err := row.Scan(&flagged)
	return flagged, err
}

const getFlaggedURL = `
SELECT id, short_id, original_url, flag_reason, flagged_by, created_at
FROM flagged_urls WHERE short_id = $1
`

func (q *Queries) GetFlaggedURL(ctx context.Context, shortID string) (FlaggedUrl, error) {
	row := q.db.QueryRowContext(ctx, getFlaggedURL, shortID)
	var i FlaggedUrl
	err := row.Scan(
		&i.ID,
		&i.ShortID,
		&i.OriginalUrl,
		&i.FlagReason,
		&i.FlaggedBy,
		&i.CreatedAt,
	)
	return i, err
}

const listFlaggedURLs = `
SELECT id, short_id, original_url, flag_reason, flagged_by, created_at
FROM flagged_urls ORDER BY created_at DESC
`

func (q *Queries) ListFlaggedURLs(ctx context.Context) ([]FlaggedUrl, error) {
	rows, err := q.db.QueryContext(ctx, listFlaggedURLs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FlaggedUrl
	for rows.Next() {
		var i FlaggedUrl
		if err := rows.Scan(
			&i.ID,
			&i.ShortID,
			&i.OriginalUrl,
			&i.FlagReason,
			&i.FlaggedBy,
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
