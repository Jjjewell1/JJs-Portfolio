FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY prisma ./prisma
RUN npx prisma generate
COPY . .

# Prerender targets a seeded SQLite DB (same flow as local builds against dev.db).
ARG DATABASE_URL=file:./dev.db
ARG SESSION_SECRET
ARG ADMIN_PASSWORD
ARG FORCE_ADMIN_RESET=false
ARG NTFY_TOPIC_URL
ARG NTFY_ACCESS_TOKEN
ENV DATABASE_URL=$DATABASE_URL \
    SESSION_SECRET=$SESSION_SECRET \
    ADMIN_PASSWORD=$ADMIN_PASSWORD \
    FORCE_ADMIN_RESET=$FORCE_ADMIN_RESET \
    NTFY_TOPIC_URL=$NTFY_TOPIC_URL \
    NTFY_ACCESS_TOKEN=$NTFY_ACCESS_TOKEN
RUN mkdir -p /app/data && npx prisma db push --accept-data-loss && node prisma/seed.mjs
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
  && npm install prisma@6 --omit=dev --ignore-scripts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY start.sh ./start.sh
RUN chmod +x ./start.sh
EXPOSE 3000
ENV PORT=3000
CMD ["./start.sh"]