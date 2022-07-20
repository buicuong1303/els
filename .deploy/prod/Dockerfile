#######################################
FROM node:14-alpine AS deps
#######################################
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

ENV NX_VERSION=13.1.4

RUN npm i -g npm@latest && \
    npm i @nrwl/cli@${NX_VERSION} -g && \
    yarn install

#######################################
FROM registry.gitlab.com/php-software-team/els/english-learning-system/deps:latest as builder
#######################################
ARG APP_LAYER
ARG APP_NAME

WORKDIR /usr/src/app

COPY . .

RUN nx build ${APP_LAYER}-${APP_NAME} --prod

#######################################
FROM node:14-alpine as runner-server
#######################################
ARG APP_LAYER
ARG APP_NAME

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist/apps/${APP_LAYER}/${APP_NAME} ./
COPY --from=builder /usr/src/app/libs/server/shared/src/lib/protobuf ./libs/server/shared/src/lib/protobuf

#######################################
FROM node:14-alpine as runner-client
#######################################
ARG APP_LAYER
ARG APP_NAME

WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist/apps/${APP_LAYER}/${APP_NAME} ./
COPY --from=builder /usr/src/app/apps/${APP_LAYER}/${APP_NAME}/next-i18next.config.js ./

# RUN yarn add next-i18next@^8.9.0
RUN yarn install && \
    yarn add next-i18next@^8.9.0 && \
    yarn add yup && \
    yarn cache clean --all