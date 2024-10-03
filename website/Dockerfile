FROM node:20-slim AS final
ENV WEBSITE_MAIN_URL=${WEBSITE_MAIN_URL}

# For health check
RUN apt update && apt -y install curl rsync

WORKDIR /opt/website
COPY package.json ./
RUN npm install
COPY . .
