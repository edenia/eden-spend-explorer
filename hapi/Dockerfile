# ---------- Base ----------
FROM node:16.17.0-slim as base
WORKDIR /app

# ---------- Builder ----------
FROM base AS builder
COPY package.json yarn.lock ./
RUN yarn --ignore-optional
COPY ./src ./src

# ---------- Release ----------
FROM base AS release
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
USER node
CMD ["node", "./src/index.js"]
