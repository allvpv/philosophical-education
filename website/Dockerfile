FROM node:20-slim AS final
ENV WEBSITE_MAIN_URL=${WEBSITE_MAIN_URL}

# For health check
RUN apt update
RUN apt -y install curl

COPY . /opt/website
ENTRYPOINT ["/opt/website/entrypoint.sh"]

WORKDIR /opt/website
RUN npm install
