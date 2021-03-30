#!/bin/bash

set -e -u -o pipefail # https://disconnected.systems/blog/another-bash-strict-mode/

cd "$(dirname "$0")" # The directory of this script

function format_key() {
  echo '-----BEGIN PUBLIC KEY-----'
  jq '.public_key' --raw-output
  echo '-----END PUBLIC KEY-----'
}

curl https://sso.redhat.com/auth/realms/redhat-external | format_key >keycloak.prod.cert

curl https://sso.qa.redhat.com/auth/realms/redhat-external | format_key >keycloak.qa.cert

curl https://sso.stage.redhat.com/auth/realms/redhat-external | format_key >keycloak.stage.cert
