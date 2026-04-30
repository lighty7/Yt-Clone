FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY prisma ./prisma
COPY package*.json ./
RUN bun install

COPY . .

RUN bunx prisma generate

FROM oven/bun:1-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
