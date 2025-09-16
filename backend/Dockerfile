FROM node:slim AS builder

WORKDIR /app

COPY package.* .
RUN npm install

COPY . .
RUN npm run build

FROM node:slim AS prod

WORKDIR /app

COPY package.* .
RUN npm install --production
COPY --from=builder /app/dist ./dist

CMD [ "npm" , "start" ]