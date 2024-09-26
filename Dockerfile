FROM node:21-alpine AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS installer

RUN apk add --no-cache curl bash

WORKDIR /app

COPY --from=builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=builder /app/apps/frontend/dist /app/apps/frontend/dist
COPY --from=builder /app/apps/backend/package.json /app/apps/backend/package.json

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm*.yaml /app/

RUN npm install -g pnpm

RUN chown -R node:node /app

USER node

RUN pnpm install --frozen-lockfile --prod

RUN mkdir -p /app/data/storage

VOLUME ["/app/data/storage"]

EXPOSE 3000

CMD ["pnpm", "start"]