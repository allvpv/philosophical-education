FROM node:20-slim AS final
ENV WEBSITE_MAIN_URL=${WEBSITE_MAIN_URL}

# For health check
RUN apt update
RUN apt -y install curl

COPY . /opt/strapi
ENTRYPOINT ["/opt/strapi/entrypoint.sh"]

WORKDIR /opt/strapi/src/plugins/ckeditor
RUN npm install

WORKDIR /opt/strapi

RUN npm install
RUN /opt/strapi/entrypoint.sh npm run strapi build
