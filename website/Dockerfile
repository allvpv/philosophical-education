FROM node:20-slim AS final

RUN apt update && apt -y install curl rsync jq

WORKDIR /opt/website
COPY package.json ./
RUN npm install
COPY . .
