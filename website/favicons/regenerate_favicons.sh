#!/usr/bin/env bash
# Exits on command fail. Treats reference to unset variables as error. Disables
# filename globbing. Whole pipeline fails if any command fails.
set -euf -o pipefail

SCRIPT=$(realpath "$0")
REPO="${SCRIPT%/*/*/*}"
FAVICONS="${REPO}/website/favicons"
PUBLIC="${REPO}/website/public"

echo "Regenerating favicons!"

function check_cmd {
  command -v "$1" > /dev/null 2>&1
}

inkscape_paths=(
  inkscape
  Inkscape
  "/Applications/Inkscape.app/Contents/MacOS/inkscape"
)

for path in "${inkscape_paths[@]}"; do
  if check_cmd "$path"; then
    INKSCAPE="$path"
    break
  fi
done

if [[ -z ${INKSCAPE+x} ]]; then
  echo "Error: Cannot find Inkscape executable" 1>&2
  exit 1
fi

TEMP="$(mktemp -d)/"

function generate_pngs {
  local sizes=(${1})
  local variants=(${2})

  names=("${sizes[@]/%/.png}") # suffix with .png
  names=("${names[@]/#/$TEMP}") # prefix with /tmp

  for i in "${!sizes[@]}"
  do
    local size="${sizes[$i]}"
    local name="${names[$i]}"
    local variant="${variants[$i]}"

    echo -e "    size ${size}\tvariant ${variant}"

    $INKSCAPE -w "${size}" -h "${size}" "${FAVICONS}/${variant}.svg" -o "${name}"
  done
}

echo "Traditional favicon"
generate_pngs "16 32 48 64" "thin thick thick thick"
convert "${names[@]}" "${PUBLIC}/favicon.ico"

echo "Apple Touch icon"
generate_pngs "180" "aapl"
mv "${names[0]}" "${PUBLIC}/touchicon.png"

echo "HD favicon for PWA"
generate_pngs "64 128 192 256 384 512" "thick thick thin thin thin thin thin"
convert "${names[@]}" "${PUBLIC}/hdfavicon.ico"
