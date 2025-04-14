#!/bin/bash
set -e

# START: rapidtox modifiations
source /rapidtox/docker/add_env.sh runtime
# END: rapidtox modifiations

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"
