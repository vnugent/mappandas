FROM node:11

ENV APP_DIR=/opt/pandas
WORKDIR ${APP_DIR}

RUN mkdir -p ${APP_DIR}

EXPOSE 3000

COPY package.json yarn.lock *.json .env ./
COPY src ./src
COPY public ./public
COPY server ./server

RUN yarn install && yarn build && rm -rf node_modules src public build/static/js/*.map && cd server && yarn install

CMD [ "node", "./server/server.js" ]
