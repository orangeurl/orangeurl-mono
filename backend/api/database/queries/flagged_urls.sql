-- name: FlagURL :one
-- Admin: Flag a URL by short_id so it shows a safety interstitial before redirecting
INSERT INTO flagged_urls (short_id, original_url, flag_reason, flagged_by)
VALUES ($1, $2, $3, $4)
ON CONFLICT (short_id) DO UPDATE SET
    flag_reason = EXCLUDED.flag_reason,
    flagged_by = EXCLUDED.flagged_by,
    created_at = NOW()
RETURNING *;

-- name: UnflagURL :exec
-- Admin: Remove a URL's safety flag
DELETE FROM flagged_urls WHERE short_id = $1;

-- name: IsURLFlagged :one
-- Check if a URL is flagged (used during resolution)
SELECT EXISTS(SELECT 1 FROM flagged_urls WHERE short_id = $1) AS is_flagged;

-- name: GetFlaggedURL :one
-- Get flagged URL details (used to render the interstitial)
SELECT * FROM flagged_urls WHERE short_id = $1;

-- name: ListFlaggedURLs :many
-- List all flagged URLs (admin view)
SELECT * FROM flagged_urls ORDER BY created_at DESC;
