ARG VCS_REF=unknown
ARG APP_VERSION=unknown

FROM node:24.14.0-bookworm-slim AS build

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:24.14.0-bookworm-slim AS runtime

ARG VCS_REF
ARG APP_VERSION

WORKDIR /app
ENV NODE_ENV=production

LABEL org.opencontainers.image.title="Personal Portfolio Website"
LABEL org.opencontainers.image.description="👋 My portfolio website built with Angular v21 — a concise introduction to who I am and what I build."
LABEL org.opencontainers.image.licenses="GPL-3.0-only"
LABEL org.opencontainers.image.version="${APP_VERSION}"
LABEL org.opencontainers.image.revision="${VCS_REF}"
LABEL org.opencontainers.image.source="https://git.lechner-systems.at/fraujulian/Personal-Portfolio-Website"

COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node scripts/static-server.mjs ./scripts/static-server.mjs

USER node

EXPOSE 3000

CMD ["node", "scripts/static-server.mjs"]
