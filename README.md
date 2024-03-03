Repository of the website for “Edukacja Filozoficzna” (EN: “Philosophical
Education”) academic journal, a peer-reviewed biannual journal published by the
University of Warsaw. The website was created as a part of the grant work on
digitizing the journal's resources.

[[Issues and articles]](https://edufil.allvpv.org/archive/latest)


### Overview
- Contenerization is not used for practical reasons (think of a „local” sysadmin
  managing a bunch of Wordpress websites on his Debian machine). Our tools must
  be familiar and cannot have a complicated pipeline.

  To (hopefully) achieve some security, I've used `bubblewrap` (a tiny wraper over
  Linux namespaces), `slirp4netns` (user-mode networking) and a bunch of bash
  scripts to separate as much as possible.

- Front-end uses Next.js and React. Strapi is an incredibly heavy CMS to manage
  the articles/issues and static content. Meilisearch is amazing search engine
  compatible with Algolia front-end libraries.

  ⚠️  I'm not a React/Next.js native speaker, so the code is... ugly. But it
  works very well and renders pretty website :)) (You have been warned, tho).

- This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, version 3.

### Setup
  - Setup is easy; everything should be self-explanatory (take a look at the
    `scripts/`, `envs/`, `nginx/`, etc.).
  - *Requirements.*
    `nginx`, `bubblewrap`, `fzf` `node`, `npm`, `rsync`, `git`, `base64`,
    `slirp4netns`, `jq`.
  - Database.
    ```
    # git clone https://github.com/philosophical-education/website.git repository
    cp ~/backup/strapi.db repository/databases/  # Or create it from scratch
    ```
  - Random keys
    ```
    alias "randkey"="dd if=/dev/urandom of=/dev/stdout bs=16 count=1 status=none | base64"

    for i in {1..8}; do
        declare "KEY${i}"=$(randkey)
    done

    echo "APP_KEYS=$KEY1,$KEY2,$KEY3,$KEY4" >> envs/strapi.env.private
    echo "API_TOKEN_SALT=$KEY5" >> envs/strapi.env.private
    echo "ADMIN_JWT_SECRET=$KEY6" >> envs/strapi.env.private
    echo "TRANSFER_TOKEN_SALT=$KEY7" >> envs/strapi.env.private
    echo "JWT_SECRET=$KEY8" >> envs/strapi.env.private
    ```
  - `npm install` the website, Strapi and Strapi plugins; then
    `scripts/new_build.sh`, `scripts/select_build.sh`.
  - Install Meilisearch.
  - Create `envs/masterkey.env.private` and set `MEILI_MASTER_KEY`.
  - Put pubilc search key in `NEXT_PUBLIC_MEILISEARCH_KEY` in `envs/website.env`.
  - Use `scripts/run.sh` directly or set up `systemd` services
