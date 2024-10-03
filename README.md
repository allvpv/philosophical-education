Repository of the website for “Edukacja Filozoficzna” (EN: “Philosophical
Education”) academic journal, a peer-reviewed biannual journal published by the
University of Warsaw. The website was created as a part of the grant work on
digitizing the journal's resources.

[[Issues and articles]](https://edufil.allvpv.org/archive/latest)


## Overview
- Front-end uses Next.js and React. Strapi is an incredibly heavy CMS to manage
  articles/issues and static content. Meilisearch is an amazing search engine
  compatible with Algolia front-end libraries.

- This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, version 3.

## Setup

### Warning ❗❗❗

Currently, the secret keys are included in the Docker image. Make sure not to
store this image in any public artifactory.


#### 1. Create secrets

* Meilisearch

  Set `MEILI_MASTER_KEY` in `./masterkey.env.private`:

  ```
  echo MEILI_MASTER_KEY=\"$(uuidgen)\" > masterkey.env.private
  ```

* Strapi

  Create `strapi/env.private` file and fill it with apriopriate variables:
  `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`,
  `JWT_SECRET`.

  ```
  alias "randkey"="dd if=/dev/urandom of=/dev/stdout bs=16 count=1 status=none | base64"

  for i in {1..8}; do
      declare "KEY${i}"=$(randkey)
  done

  echo "export APP_KEYS=$KEY1,$KEY2,$KEY3,$KEY4" >> strapi/env.private
  echo "export API_TOKEN_SALT=$KEY5" >> strapi/env.private
  echo "export ADMIN_JWT_SECRET=$KEY6" >> strapi/env.private
  echo "export TRANSFER_TOKEN_SALT=$KEY7" >> strapi/env.private
  echo "export JWT_SECRET=$KEY8" >> strapi/env.private
  ```

* Website

  Create `website/env.private` file and fill it with apriopriate variables:
  `STRAPI_SECRET_KEY`, `NEXT_PUBLIC_MEILISEARCH_KEY`.

  ```
  export STRAPI_SECRET_KEY="<...>"
  export NEXT_PUBLIC_MEILISEARCH_KEY="<...>"
  ```

  - You can obtain valid `NEXT_PUBLIC_MEILISEARCH_KEY` by using the REST
    API from the meilisearch container (ensure the container is started
    first, for example by running `docker-compose up --build`):

    ```
    $ docker ps
    CONTAINER ID   IMAGE                             COMMAND  [...]
    abcdef012345   getmeili/meilisearch:v1.10        "tini -- [...]
    [...]

    $ docker exec -it abcdef012345 sh
    ```

    Inside the container:

    ```
    $ curl -X GET 'http://localhost/keys?limit=3' -H 'Authorization: Bearer <MEILI_MASTER_KEY_HERE>'
    ```

    The required key is 'Default Search API Key' from the JSON output.

  - You can retrieve the `STRAPI_SECRET_KEY` from Strapi's admin panel by navigating to Settings ➡️ API Tokens.
    Make sure to grant **read** access to everything.

#### 2. Adjust the main URL

Modify the main URL the website uses to reference itself in `.env` file:

```
WEBSITE_MAIN_URL="http://192.168.106.5"
```

#### 3. Verify that all necessary files and databases are in place.

```
cp ~/backup/strapi_mod.db ./storage/
cp -r ~/backup/old_website ./storage/old_website
cp -r ~/backup/strapi_public ./storage/strapi_public
mkdir -p ./storage/data.ms
```

#### 4. Build and start the application
Start the application with the following command:

```
docker-compose up --build
```

Because Strapi is a bloatware, installing all NPM dependencies and building
the website and backend can take around 20 minutes.

Once all containers are up, configure a reverse proxy to expose port 8080 to
the address specified in `WEBSITE_MAIN_URL`.

## New version deployment

You should avoid any downtime between deployments (zero-downtime deployment).

To achieve this, you can use `docker-compose` (with it's built-in loadbalancer)
to:
- Make a secondary replica of a service.
- Temporary stop the first replica.
- Test everything, and then:
  * destroy the first replia, or
  * rollback.

Here is how you can do that.

First, create a secondary replia:

```
docker-compose build website --no-cache
docker-compose up -d --no-deps --scale website=2 --no-recreate website
```

Once the service started and is healthy, use `docker ps` to obtain ID of the
old and the new replica (look at `CREATED` timestamp). Stop the former and
immediately purge the Nginx cache:

```
docker stop <OLD_CONTAINER_ID> && rm -fr ./storage/nginx_cache/*
```

Test if everything works correctly.
* If so, you can remove the old container:

        docker stop <OLD_CONTAINER_ID>
        docker rm <OLD_CONTAINER_ID>

* Alternatively, if there is a problem, you can rollback:

        docker start <OLD_CONTAINER_ID>
        docker stop <NEW_CONTAINER_ID> && rm -fr ./storage/nginx_cache/*
        docker rm <NEW_CONTAINER_ID>

  Then, remember to `git reset` and rebuild the image to reference the old,
  working version of the service.


You probably can also configure a solution like Docker Swarm mode, Kubernetes or
Traefik to do it automatically.
