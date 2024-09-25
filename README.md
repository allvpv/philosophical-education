Repository of the website for “Edukacja Filozoficzna” (EN: “Philosophical
Education”) academic journal, a peer-reviewed biannual journal published by the
University of Warsaw. The website was created as a part of the grant work on
digitizing the journal's resources.

[[Issues and articles]](https://edufil.allvpv.org/archive/latest)


### Overview
- Front-end uses Next.js and React. Strapi is an incredibly heavy CMS to manage
  articles/issues and static content. Meilisearch is an amazing search engine
  compatible with Algolia front-end libraries.

- This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, version 3.

### Setup

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
  STRAPI_SECRET_KEY="<...>"
  NEXT_PUBLIC_MEILISEARCH_KEY="<...>"
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

Configure a reverse proxy to expose port 8080 to the address specified in
`WEBSITE_MAIN_URL`.
