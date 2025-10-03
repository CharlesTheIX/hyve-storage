FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 4022

RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001
USER appuser

CMD ["node", "dist/server.js"]
