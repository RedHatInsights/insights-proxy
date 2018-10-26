/*global module, process, require, __dirname*/
const tryRequire = require('try-require');
const lodash = require('lodash');
const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const fs = require('fs');
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const protocol = (process.env.SSL === 'true') ? 'https' : 'http';
const port = process.env.PORT || 8002;

const keycloakPubkeys = {
    prod: fs.readFileSync(__dirname + '/certs/keycloak.prod.cert', 'utf8'),
    qa:   fs.readFileSync(__dirname + '/certs/keycloak.qa.cert', 'utf8')
};

const buildUser = input => {

    const user = {
        identity: {
            id: input.user_id,
            org_id: input.account_id,
            account_number: input.account_number,
            username: input.username,
            email: input.email,
            first_name: input.firstName,
            last_name: input.lastName,
            address_string: `"${input.firstName} ${input.lastName}" ${input.email}`,
            is_active: true,
            locale: input.lang,
            is_org_admin: lodash.includes(input.realm_access.roles, 'admin:org:all'),
            is_internal: lodash.includes(input.realm_access.roles,  'redhat:employees')
        }
    };

    return user;
};

const authPlugin = (req, res) => {
    const noop = { then: (cb) => { cb(); } };

    if (!req || !req.headers || !req.headers.cookie) { return noop; } // no cookies short circut
    const cookies = cookie.parse(req.headers.cookie);
    if (!cookies.rh_jwt) { return noop; } // no rh_jwt short circut

    return new Promise (function (resolve, reject) {
        // TODO make this work with QA and PROD
        jwt.verify(cookies.rh_jwt, keycloakPubkeys.prod, {}, function jwtVerifyPromise(err, decoded) {
            if (err) { console.log(err); reject(err); } // alert user on error
            const user = buildUser(decoded);
            req.headers['x-rh-identity'] = base64.encode(user);
            resolve(user);
        });
    });
};


const defaults = {
    plugin: authPlugin,
    bs: {
        https: {
            key: __dirname + '/ssl/key.pem',
            cert: __dirname + '/ssl/cert.pem'
        }
    },
    esi: {
        allowedHosts: [
            /^https:\/\/access.*.redhat.com$/
        ]
    },
    host: process.env.SPANDX_HOST || 'prod.foo.redhat.com',
    port: process.env.SPANDX_PORT || 1337,
    open: false,
    startPath: '/',
    verbose: true,
    routes: {}
};

if (process.env.LOCAL_API === 'true') {
    defaults.routes['/r/insights'] = { host: `https://${localhost}:9001` };
}

if (process.env.LOCAL_CHROME === 'true') {
    defaults.routes['/insights/static/chrome']     = '/chrome/';
    defaults.routes['/insightsbeta/static/chrome'] = '/chrome/';
} else {
    defaults.routes['/insights/static/chrome']     = { host: 'https://access.redhat.com' };
    defaults.routes['/insightsbeta/static/chrome'] = { host: 'https://access.redhat.com' };
}

defaults.routes['/insights'] = { host: `${protocol}://${localhost}:${port}` };
defaults.routes['/'] = { host: 'https://access.redhat.com' };

const custom = tryRequire('/config/spandx.config') || {};
const ret = lodash.defaultsDeep(custom, defaults);

console.log('\n');
console.log('### USING SPANDX CONFIG ###');
console.log(ret);
console.log('###########################');
console.log('For more info see: https://github.com/redhataccess/spandx');
console.log('\n');

module.exports = ret;
