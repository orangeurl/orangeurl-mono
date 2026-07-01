-- name: GetSetting :one
-- Read a global setting value by key
SELECT value FROM app_settings WHERE key = $1;

-- name: SetSetting :exec
-- Upsert a global setting value
INSERT INTO app_settings (key, value, updated_at)
VALUES ($1, $2, NOW())
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();
