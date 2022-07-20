#######################################
FROM node:14
#######################################
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

ENV NX_VERSION=13.1.4

RUN npm i -g npm@latest && \
    npm i @nrwl/cli@${NX_VERSION} -g && \
    yarn install
