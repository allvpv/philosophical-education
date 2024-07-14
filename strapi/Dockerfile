FROM node:20-slim AS final

# For health check
RUN apt update
RUN apt -y install curl

COPY . /opt/strapi

ENV DATABASE_FILENAME=${DATABASE_FILENAME}
ENV DATABASE_CLIENT=sqlite
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337
ENV PUBLIC=/srv

WORKDIR /opt/strapi/src/plugins/ckeditor
RUN npm install

WORKDIR /opt/strapi
RUN npm install
RUN npm run strapi build

EXPOSE 1337
