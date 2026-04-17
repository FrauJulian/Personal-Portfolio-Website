FROM node:24.14.0-bookworm-slim AS build

WORKDIR /app
ENV HUSKY=0
ARG APP_VERSION

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:24.14.0-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV MAIN_PORT=3001
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3001

CMD ["npm", "start"]
