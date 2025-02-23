#!/bin/sh

get_public_meilisearch_key() {
  curl -X GET "$MEILI_URL_INTERNAL/keys?limit=3"                              \
       -H "Authorization: Bearer $MEILI_MASTER_KEY" |                         \
    jq -r '.results | .[] | select(.name == "Default Search API Key") | .key'
}

export NEXT_PUBLIC_MEILISEARCH_KEY=$(get_public_meilisearch_key)
echo the public meilisearch key is: $NEXT_PUBLIC_MEILISEARCH_KEY


if [ "$1" = "--dev" ]; then
  echo "Running in development mode"
  npm run dev
else
  # Must be done when Strapi is already up and running. That's why it's not in
  # a Dockerfile. Also, the meilisearch public key (see above) gets embedded at
  # this stage.
  npm run build

  rsync -a /opt/website/builds/current/static/* /nextjs_static
  rm -fr /opt/website/builds/current/static
  ln -s /nextjs_static /opt/website/builds/current/static

  node /opt/website/builds/current/standalone/server.js
fi
