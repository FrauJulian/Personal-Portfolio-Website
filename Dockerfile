FROM node:24.14.0-bookworm-slim AS build

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:24.14.0-bookworm-slim AS prod-deps

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:24.14.0-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server/server.mjs"]
