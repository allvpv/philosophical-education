FROM node:20-slim AS final
ENV WEBSITE_MAIN_URL=${WEBSITE_MAIN_URL}

# For health check
RUN apt update && apt -y install curl

WORKDIR /opt/strapi/src/plugins/ckeditor
COPY src/plugins/ckeditor/package.json .
RUN npm install --loglevel verbose

WORKDIR /opt/strapi
COPY package.json .
RUN npm install --loglevel verbose

COPY . .

ENTRYPOINT ["/opt/strapi/entrypoint.sh"]
RUN /opt/strapi/entrypoint.sh npm run strapi build
