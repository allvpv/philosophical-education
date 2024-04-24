#!/bin/bash
# Exits on command fail. Treats reference to unset variables as error. Disables
# filename globbing. Whole pipeline fails if any command fails.
set -euf -o pipefail

if [[ -z "${1:-}" ]] || [[ "$1" != "strapi" && "$1" != "website" ]]
then
  echo "$0 strapi|website"
  exit 1
fi

SCRIPT=$(realpath "$0")
REPO="${SCRIPT%/*/*}"

if [[ "$1" == "website" ]]
then
  cd "${REPO}"/website
  npm run build
else
  cd "${REPO}"/strapi
  env $(cat "${REPO}/envs/strapi.env" "${REPO}/envs/strapi.env.private" | xargs) \
    npm run strapi build
fi

CURRENT=$(date +"%Y-%m-%d__%H-%M-%S__%4N")

if [[ "$1" == "website" ]]
then
  mv builds/current "builds/${CURRENT}"
else
  mkdir -p "builds/${CURRENT}/"
  rsync -aq . "builds/${CURRENT}/" --exclude builds
fi
