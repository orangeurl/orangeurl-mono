# orangeurl

Monorepo for orangeurl.live — affordable URL shortener.

## Layout

- `web/`     — Next.js 15 frontend (App Router, Clerk auth)
- `backend/` — Go Fiber API + Postgres + Redis
- `infra/`   — Single-EC2 deploy: Caddy + docker-compose

## Local dev

```bash
# Backend stack
cd backend && make dev

# Web
cd web && npm install && npm run dev
```

## Production deploy

See `infra/README.md`. TL;DR: push to `main` → GitHub Action rsyncs the
tree to EC2 and runs `docker compose up -d --build`.
