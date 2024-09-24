FROM node:20-slim AS final
ENV WEBSITE_MAIN=${WEBSITE_MAIN}

COPY . /opt/website
ENTRYPOINT ["/opt/website/entrypoint.sh"]

WORKDIR /opt/website
RUN npm install
