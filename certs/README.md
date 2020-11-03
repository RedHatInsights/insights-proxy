# Certs

Update Criteria: These certs don't have an expiration date as such but when there is a URL change (upshift to psi per instance) and a developer is using local frontends and backends the JWT verification fails with the X-RH-IDENTITY header not being sent to the backend. When it occurs just follow the steps below to update the certs for different environments.

## prod

Last Updated: 11/03/19

URL: https://sso.redhat.com/auth/realms/redhat-external copy the "public-key" value to update the keycloack.prod.cert file

## qa

Last Updated: 7/12/19

URL: https://sso.qa.redhat.com/auth/realms/redhat-external copy the "public-key" value to update the keycloack.qa.cert file

## stage

Last Updated: 7/12/19

URL: https://sso.stage.redhat.com/auth/realms/redhat-external copy the "public-key" value to update the keycloack.stage.cert file
