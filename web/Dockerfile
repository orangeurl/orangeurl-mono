# syntax=docker/dockerfile:1.7
# Next.js standalone build for self-hosted EC2.

FROM node:20-alpine AS deps
WORKDIR /app
# canvas needs native deps for prebuilds; keep them lean.
RUN apk add --no-cache libc6-compat python3 make g++ \
      cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev pkgconfig
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat cairo jpeg pango giflib pixman
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache cairo jpeg pango giflib pixman \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
