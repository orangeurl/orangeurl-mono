package database

import (
	"context"
)

// -- App Settings (global key/value store) --

const getSetting = `SELECT value FROM app_settings WHERE key = $1`

// GetSetting returns the stored value for a key. If the key does not exist it
// returns ("", sql.ErrNoRows) so callers can fall back to a default.
func (q *Queries) GetSetting(ctx context.Context, key string) (string, error) {
	row := q.db.QueryRowContext(ctx, getSetting, key)
	var value string
	err := row.Scan(&value)
	return value, err
}

const setSetting = `
INSERT INTO app_settings (key, value, updated_at)
VALUES ($1, $2, NOW())
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW()
`

func (q *Queries) SetSetting(ctx context.Context, key, value string) error {
	_, err := q.db.ExecContext(ctx, setSetting, key, value)
	return err
}

// GetBoolSetting resolves a boolean setting, returning def when the key is
// absent or unparseable.
func (q *Queries) GetBoolSetting(ctx context.Context, key string, def bool) bool {
	value, err := q.GetSetting(ctx, key)
	if err != nil {
		return def
	}
	switch value {
	case "true", "1", "on", "yes":
		return true
	case "false", "0", "off", "no":
		return false
	default:
		return def
	}
}
