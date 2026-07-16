# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# Full node_modules (not just the standalone trace) so the `prisma` CLI is
# available at runtime — needed to run migrations on container start when
# there's no separate `migrate` service (e.g. deploying as a single Coolify
# app instead of via docker-compose.yml).
COPY --from=builder /app/node_modules ./node_modules

# Uploaded product images are written here at runtime — mount a volume
# over this path (see docker-compose.yml) so they survive redeploys.
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Applying pending migrations on every start is safe/idempotent — it only
# runs migrations that haven't been applied yet. Seeding is NOT run here
# since it resets demo product/FAQ content; run it manually once instead.
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
