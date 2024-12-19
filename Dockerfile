# Build Stage
FROM node:22 AS build
RUN npm i -g pnpm
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm install
COPY . .
RUN pnpm build

# Production Stage
FROM node:current-alpine3.21
RUN npm i -g pnpm
COPY --from=build ./dist .
COPY ./package.json .
COPY ./.env .
RUN pnpm install
EXPOSE 3000
CMD ["node", "./main.js"]