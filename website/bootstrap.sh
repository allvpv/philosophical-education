#!/bin/sh

get_public_meilisearch_key() {
  curl -X GET 'http://meilisearch/keys?limit=3'                               \
       -H "Authorization: Bearer $MEILI_MASTER_KEY" |                         \
    jq -r '.results | .[] | select(.name == "Default Search API Key") | .key'
}

export NEXT_PUBLIC_MEILISEARCH_KEY=$(get_public_meilisearch_key)
echo the public meilisearch key is: $NEXT_PUBLIC_MEILISEARCH_KEY

# Must be done when Strapi is already up and running.
# (That's why it's not in a Dockerfile).
# Also, the public key gets embedded at this stage.
npm run build

# Purge the NGINX cache; otherwise, there will be a mismatch between the
# `nginx` cache and the `next.js` server, negatively impacting the SPA
# experience. However, nothing bad will happen: the site will still be usable.
rsync -a /opt/website/builds/current/static/* /nextjs_static
rm -fr /opt/website/builds/current/static
ln -s /nextjs_static /opt/website/builds/current/static
rm -fr /nginx_cache/*


node /opt/website/builds/current/standalone/server.js
