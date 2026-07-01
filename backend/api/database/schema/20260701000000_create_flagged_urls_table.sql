-- +goose Up
-- Migration for admin-flagged URLs shown behind a safety interstitial
CREATE TABLE flagged_urls(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_id VARCHAR(255) NOT NULL UNIQUE,
    original_url TEXT,
    flag_reason TEXT NOT NULL,
    flagged_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups when resolving URLs
CREATE INDEX idx_flagged_urls_short_id ON flagged_urls(short_id);

-- +goose Down
DROP INDEX IF EXISTS idx_flagged_urls_short_id;
DROP TABLE flagged_urls;
