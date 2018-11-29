FROM node:11

ENV APP_DIR=/opt/pandas
WORKDIR ${APP_DIR}

RUN mkdir -p ${APP_DIR}

EXPOSE 3000

RUN yarn global add serve
COPY package.json yarn.lock *.json ./
COPY src ./src
COPY public ./public

RUN yarn install && yarn build && rm -rf node_modules src public

CMD [ "serve", "-p", "3000", "-s", "-n", "./build" ]