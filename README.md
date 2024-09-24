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
  - Secrets
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
      STRAPI_SECRET_KEY="<GET IT FROM STRAPI ADMIN PANEL>"
      NEXT_PUBLIC_MEILISEARCH_KEY="<GET IT USING REST API FROM MEILISEARCH>"
      ```

    * Meilisearch

      Set `MEILI_MASTER_KEY` in `./masterkey.env.private`:

      ```
      MEILI_MASTER_KEY="<REDACTED>"
      ```

 - Main URL.

   Modify the main URL the website uses to reference itself in `.env` file:

   ```
   WEBSITE_MAIN_URL="http://192.168.106.5"
   ```
    
  - Database.
    ```
    cp ~/backup/strapi_mod.db ./databases/
    ```

