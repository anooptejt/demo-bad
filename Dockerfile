FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public
ARG GIT_SHA=unknown
ENV GIT_SHA=$GIT_SHA NODE_ENV=production PORT=8080
USER node
EXPOSE 8080
CMD ["node", "server.js"]
