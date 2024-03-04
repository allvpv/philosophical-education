#!/bin/bash
# Exits on command fail. Treats reference to unset variables as error. Disables
# filename globbing. Whole pipeline fails if any command fails.
set -euf -o pipefail

SCRIPT="$(realpath "$0")"
REPO="${SCRIPT%/*/*}"

if [[ "$#" -eq 0 || ! -d "${1}" ]]; then
  echo "Provide a valid backup directory as a first argument" 1>&2
  exit 1
fi

BACKUP_DIR="${1}"

rsync -az "${REPO}/nginx/strapi_public" "${BACKUP_DIR}"
rsync -az "${REPO}/databases" "${BACKUP_DIR}"

pushd && trap 'popd' EXIT

cd "${BACKUP_DIR}"
git add ./**
git diff-index --quiet HEAD || git commit -m "Backup: $(date)"
