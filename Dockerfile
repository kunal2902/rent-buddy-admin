# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install  --no-audit --no-fund

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules

RUN npx next telemetry disable
RUN npm run build -- --no-lint

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]