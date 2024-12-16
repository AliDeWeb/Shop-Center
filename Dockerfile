FROM node:current-alpine3.21

RUN npm install -g pnpm

WORKDIR /dist

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm build

CMD [ "pnpm", "start" ]