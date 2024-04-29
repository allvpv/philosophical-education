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
REPO=${SCRIPT%/*/*}

cd ${REPO}/$1/builds

set +f # We need globbing for this
CHOICE=$(ls -1dr ????-??-??__??-??-??__???? | fzf)
set -f

if [[ -f selected ]]; then
  CURRENT=$(<selected)
fi

cp selected previous
echo ${CHOICE} >| selected

# TODO: Atomic restart
sudo systemctl restart $1.service

if [[ "$1" == "website" && "$CURRENT" != "$CHOICE" ]]; then
  echo "Purging nginx cache"
  sudo find /var/cache/nginx -type f -delete
fi
