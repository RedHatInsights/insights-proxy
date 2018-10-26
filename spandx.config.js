/*global module, process, require*/

const tryRequire = require('try-require');
const lodash = require('lodash');
const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const fs = require('fs');
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const protocol = (process.env.SSL === 'true') ? 'https' : 'http';
const port = process.env.PORT || 8002;

let pubkey = fs.readFileSync(__dirname + '/certs/prod-key.cert', 'utf8');

const defaults = {
    plugin: (req, res) => {

        const noop = {then: (cb) => {cb();}};

        if (!req.headers.cookie) {
            return noop;
        }

        const cookies = cookie.parse(req.headers.cookie);
        if (!cookies.rh_jwt) {
            console.log('no cookie');
            return noop;
        }

        let promise = new Promise (function (resolve, reject) {
            jwt.verify(cookies.rh_jwt, pubkey, {}, function jwtVerifyPromise(err, decoded) {

                if (err) {
                    console.log(err);
                    reject(err);
                }

                let user = {
                    identity: {
                        id: decoded.user_id,
                        org_id: decoded.account_id,
                        account_number: decoded.account_number,
                        username: decoded.username,
                        email: decoded.email,
                        first_name: decoded.firstName,
                        last_name: decoded.lastName,
                        address_string: `"${decoded.firstName} ${decoded.lastName}" ${decoded.email}`,
                        is_active: true,
                        locale: decoded.lang,
                        is_org_admin: true,
                        is_internal: true
                    }
                };

                req.headers['x-rh-identity'] = base64.encode(user);

                console.log(user);

                resolve(user);
            });
        });

        return promise;
    },
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
