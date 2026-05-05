ARG NODE_VERSION=24.14.0

FROM node:${NODE_VERSION} AS dev

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
