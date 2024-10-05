FROM node:20-slim AS final
ENV WEBSITE_MAIN_URL=${WEBSITE_MAIN_URL}

RUN apt update && apt -y install curl rsync jq

WORKDIR /opt/website
COPY package.json ./
RUN npm install
COPY . .
