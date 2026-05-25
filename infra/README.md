# orangeurl infra

Single-EC2 deployment. Same pattern as `allto/infra`: Caddy (auto-TLS) →
{ web, api }; Postgres + Redis on the side.

## Layout

```
caddy (:80/:443)
  ├── orangeurl.live           → /XXXXXX → api:3000, else → web:3000
  ├── www.orangeurl.live       → same as orangeurl.live
  ├── app.orangeurl.live       → web:3000  (Next.js standalone)
  └── api.orangeurl.live       → api:3000  (Go Fiber)

postgres:5432   redis:6379     (internal-only, no host ports)
```

## First-time EC2 setup

1. Provision Ubuntu 22.04+ EC2. Open 80/443 in the security group.
2. Point DNS A records (`orangeurl.live`, `www`, `app`, `api`) at the EIP.
3. Install Docker + compose plugin.
4. As the deploy user:
   ```
   sudo mkdir -p /opt/orangeurl && sudo chown $USER /opt/orangeurl
   ```

## Deploy

From your laptop:

```bash
./infra/deploy.sh <ec2-host> ubuntu
```

Then on the EC2 host (one-time): copy `infra/.env.example` → `infra/.env`,
fill in real values, then `docker compose up -d --build` again so the
running services pick up the env.

## GitHub Actions

Repo secrets required:
- `DEPLOY_SSH_KEY` — ed25519 private key authorized on the EC2
- `DEPLOY_HOST`    — public DNS or IP
- `DEPLOY_USER`    — typically `ubuntu`

Push to `main` → workflow rsyncs + `docker compose up -d --build`.

## DB migrations

Backend schema files live in `backend/api/database/schema/`. Run them on
first boot via your usual tool (goose / sqlc / psql). The compose file
does not run migrations automatically.
