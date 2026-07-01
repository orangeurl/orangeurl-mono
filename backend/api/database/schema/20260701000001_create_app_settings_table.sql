-- +goose Up
-- Key/value store for global admin-controlled settings (e.g. safety interstitial toggle)
CREATE TABLE app_settings(
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Safety interstitial is off by default; admins opt in from the admin panel.
INSERT INTO app_settings (key, value) VALUES ('interstitial_enabled', 'false')
    ON CONFLICT (key) DO NOTHING;

-- +goose Down
DROP TABLE app_settings;
