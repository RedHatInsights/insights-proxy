#certs

Update Criteria: These certs don't have an expiration date as such but when there is a URL change (upshift to psi per instance) and a developer is using local frontends and backends the JWT verification fails with the X-RH-IDENTITY header not being sent to the backend. When it occurs just follow the steps below to update the certs for different environments.

Run `update.sh` from this directory to update.
