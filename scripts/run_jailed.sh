#!/bin/bash
# Exits on command fail. Treats reference to unset variables as error. Disables
# filename globbing. Whole pipeline fails if any command fails.
set -euf -o pipefail
# Enable bash job control
set -m

if [[ "$#" -eq 0 || ("$1" != "strapi" && "$1" != "website") ]]; then
  echo "$0 strapi|website"
  exit 1
fi

SCRIPT=$(realpath "$0")
REPO=${SCRIPT%/*/*}
TEMP="$(mktemp -d)"
FIFO="${TEMP}/fifo"
SOCK="${TEMP}/sock"

# FIFOs to communicate and prevent races
mkfifo "${FIFO}_bwrap"
mkfifo "${FIFO}_slirp"
mkfifo "${FIFO}_container"

# We don't care about a "broken pipe"
trap "" PIPE

# Cleanup
trap 'echo Exiting!; kill $(jobs -p); rm -fr ${TEMP}' EXIT

JAIL_COMMON=(
  --unshare-all
  --unshare-user
  --unshare-net
  --unshare-pid
  --tmpfs /
  --ro-bind /usr /usr
  --dir /tmp
  --dir /proc
  --dir /dev
  --dir /etc
  --dir /opt
# Useful for debugging the jail
#  --ro-bind /etc/alternatives /etc/alternatives
#  --ro-bind /etc/profile /etc/profile
#  --ro-bind /etc/profile.d /etc/profile.d
#  --ro-bind /etc/bash.bashrc /etc/bash.bashrc
#  --ro-bind /etc/bash_completion /etc/bash_completion
#  --ro-bind /etc/bash_completion.d /etc/bash_completion.d
#  --ro-bind $(realpath ~/.bashrc) /opt/.bashrc
  --proc /proc
  --symlink usr/bin /bin
  --symlink usr/sbin /sbin
  --symlink usr/lib /lib
  --symlink usr/lib64 /lib64
  --bind "${FIFO}_container" /tmp/fifo_container
  --ro-bind "${REPO}/scripts/passwd.jail" /etc/passwd
  --uid 1000 --gid 1000
  --clearenv
  --setenv PATH "/usr/local/bin:/usr/bin:/bin"
  --setenv PAGER "less"
  --setenv LESS "-R"
  --setenv MANPATH "/usr/local/man"
  --setenv TERM "$TERM"
  --setenv USER "prisoner"
  --setenv HOME "/opt"
  --bind "${REPO}/scripts/resolv.slirp.conf" "/etc/resolv.conf"
  --bind "${REPO}/scripts/hosts.slirp" "/etc/hosts"
  --die-with-parent
  --as-pid-1
  --new-session
  --hostname website-jail
)

if [[ "$1" == "website" ]]
then
  SELECTED=$(<"${REPO}/website/builds/selected")
  BUILD=$(realpath "${REPO}/website/builds/${SELECTED}")

  [[ -h "${REPO}/nginx/website_static" ]] && unlink "${REPO}/nginx/website_static"
  ln -s "$(realpath "${BUILD}/static")" "${REPO}/nginx/website_static"

  mkdir -p "${BUILD}/standalone/builds/current/cache"

  JAIL_WEBSITE=(
    "${JAIL_COMMON[@]}"
    --bind "${BUILD}" "/opt/website"
    --ro-bind "${REPO}/envs/website.env.private" "/opt/website/website.env.private"
    --bind "${BUILD}/standalone/builds/current/cache" /opt/website/standalone/builds/current/cache
    --bind "${BUILD}/standalone/builds/current/server/app"
           /opt/website/standalone/builds/current/server/app
    --remount-ro /opt/website
    --chdir /opt/website
  )

  # Set up the jail for the website server. Wait on FIFO.
  bwrap "${JAIL_WEBSITE[@]}" --json-status-fd 3 -- /usr/bin/bash -c \
      "set -o allexport;                        \
       source /opt/website/website.env.private; \
       set +o allexport;                        \
       read < /tmp/fifo_container;              \
       /usr/bin/node /opt/website/standalone/server.js" \
    3>${FIFO}_bwrap &

  GUEST_PORT=3000
  HOST_PORT=3000

else
  SELECTED=$(<"${REPO}"/strapi/builds/selected)
  BUILD=$(realpath "${REPO}"/strapi/builds/"${SELECTED}")

  JAIL_STRAPI=(
    "${JAIL_COMMON[@]}"
    --dir /run
    --bind "${BUILD}" "/opt/strapi"
    --ro-bind "${REPO}/envs/strapi.env" "/opt/strapi/strapi.env"
    --ro-bind "${REPO}/envs/strapi.env.private" "/opt/strapi/strapi.env.private"
    --ro-bind "${REPO}/envs/masterkey.env.private" "/opt/strapi/masterkey.env.private"
    --remount-ro /opt/strapi
    --bind "${REPO}/databases/strapi_mod.db" /run/db
    --bind "${REPO}/nginx/strapi_public" /srv
    --chdir /opt/strapi
  )

  # Set up the jail for the Strapi server. Wait on FIFO.
  bwrap "${JAIL_STRAPI[@]}" --json-status-fd 3 -- /usr/bin/bash -c \
      "set -o allexport;                           \
       source /opt/strapi/strapi.env;              \
       source /opt/strapi/strapi.env.private;      \
       source /opt/strapi/masterkey.env.private;   \
       set -o allexport;                           \
       read < /tmp/fifo_container;                 \
       /usr/bin/npm run start" \
    3>${FIFO}_bwrap &

  GUEST_PORT=1337
  HOST_PORT=1337
fi

# Get the PID
if read line <${FIFO}_bwrap; then
    if [[ "$line" == 'quit' ]]; then
        echo "Error! Cannot get the status."
        exit 1
    fi
    STATUS=${line}
    # Parse JSON
    PID=$(jq -r '."child-pid"' <<< ${STATUS})
fi

# Create userspace network stack and pin it to the jail namespace
slirp4netns --configure --mtu=65520  \
            --ready-fd=3 --api-socket ${SOCK} ${PID} tap0 \
            3>${FIFO}_slirp &

# Wait until slirp is done
read <${FIFO}_slirp || true

# Setup port forwarding
json="{
  \"execute\": \"add_hostfwd\",
  \"arguments\": {
    \"proto\": \"tcp\",
    \"host_addr\": \"0.0.0.0\",
    \"host_port\": ${HOST_PORT},
    \"guest_addr\": \"10.0.2.100\",
    \"guest_port\": ${GUEST_PORT}
  }
}"

printf "Forwarding host's ${HOST_PORT} port to guest's ${GUEST_PORT}."
printf "%s" "$json" | socat - unix-connect:${SOCK}
printf "\n"

# „Unlock” the process inside the jail.
printf '\n' > ${FIFO}_container

# Bring the actual process to the foreground
fg "%bwrap"
