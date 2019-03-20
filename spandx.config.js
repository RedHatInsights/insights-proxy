/*global module, process, require, __dirname*/
const tryRequire = require('try-require');
const lodash = require('lodash');
const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const fs = require('fs');
const url = require('url-parse');
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const protocol = (process.env.SSL === 'true') ? 'https' : 'http';
const port = process.env.PORT || 8002;

const PORTAL_BACKEND_MARKER = 'PORTAL_BACKEND_MARKER';

const keycloakPubkeys = {
    prod:  fs.readFileSync(__dirname + '/certs/keycloak.prod.cert',  'utf8'),
    stage: fs.readFileSync(__dirname + '/certs/keycloak.stage.cert', 'utf8'),
    qa:    fs.readFileSync(__dirname + '/certs/keycloak.qa.cert',    'utf8')
};

const buildUser = input => {

    const user = {
        identity: {
            account_number: input.account_number,
            type: 'User',
            user: {
                username: input.username,
                email: input.email,
                first_name: input.firstName,
                last_name: input.lastName,
                is_active: true,
                is_org_admin: input.is_org_admin,
                is_internal: input.is_internal,
                locale: input.lang
            },

            internal: {
                org_id: input.account_id
            }
        }
    };

    return user;
};

const envMap = {
    ci: {
        keycloakPubkey: keycloakPubkeys.qa,
        target: 'https://ci.cloud.paas.upshift.redhat.com',
        str: 'ci'
    },
    qa: {
        keycloakPubkey: keycloakPubkeys.qa,
        target: 'https://qa.cloud.paas.upshift.redhat.com',
        str: 'qa'
    },
    stage: {
        keycloakPubkey: keycloakPubkeys.stage,
        target: 'https://stage.cloud.paas.upshift.redhat.com',
        str: 'stage'
    },
    prod: {
        keycloakPubkey: keycloakPubkeys.prod,
        target: 'https://cloud.redhat.com',
        str: 'prod'
    }
};

const authPlugin = (req, res, target) => {
    let env = envMap.prod;

    switch (req.headers['x-spandx-origin']) {
        case 'ci.foo.redhat.com':    env = envMap.ci;    break;
        case 'qa.foo.redhat.com':    env = envMap.qa;    break;
        case 'stage.foo.redhat.com': env = envMap.stage; break;
        case 'prod.foo.redhat.com':  env = envMap.prod;  break;
        default: env = false;
    }

    if (target === PORTAL_BACKEND_MARKER) {
        target = env.target;
        console.log(`    --> mangled ${PORTAL_BACKEND_MARKER} to ${target}`);
    }

    const noop = { then: (cb) => { cb(target); } };
    if (!req || !req.headers || !req.headers.cookie) { return noop; } // no cookies short circut

    const cookies = cookie.parse(req.headers.cookie);
    if (!cookies.rh_jwt) { return noop; } // no rh_jwt short circut

    return new Promise (function (resolve, reject) {
        jwt.verify(cookies.rh_jwt, env.keycloakPubkey, {}, function jwtVerifyPromise(err, decoded) {
            if (err) { resolve(target); return; } // silently miss on error
            const user = buildUser(decoded);
            const unicodeUser = new Buffer(JSON.stringify(user), "utf8");
            req.headers["x-rh-identity"] = unicodeUser.toString("base64");
            resolve(target);
        });
    });
};

const defaults = {
    routerPlugin: authPlugin,
    bs: {
        https: {
            key:  __dirname + '/ssl/key.pem',
            cert: __dirname + '/ssl/cert.pem'
        }
    },
    esi: {
        allowedHosts: [
            /^https:\/\/.*cloud.paas.upshift.redhat.com$/
        ]
    },
    host: {
        'ci.foo.redhat.com':    'ci.foo.redhat.com',
        'qa.foo.redhat.com':    'qa.foo.redhat.com',
        'stage.foo.redhat.com': 'stage.foo.redhat.com',
        'prod.foo.redhat.com':  'prod.foo.redhat.com'
    },
    port: process.env.SPANDX_PORT || 1337,
    open: false,
    startPath: '/',
    verbose: true,
    routes: {}
};

if (process.env.LOCAL_CHROME === 'true') {
    defaults.routes['/apps/chrome']     = '/chrome/';
    defaults.routes['/beta/apps/chrome'] = '/chrome/';
} else {
    defaults.routes['/apps/chrome']     = { host: PORTAL_BACKEND_MARKER };
    defaults.routes['/apps/beta/chrome'] = { host: PORTAL_BACKEND_MARKER };
}

defaults.routes['/'] = { host: PORTAL_BACKEND_MARKER };

const CUSTOM_CONF_PATH = process.env.CUSTOM_CONF_PATH || '/config/spandx.config.js';

if (process.env.CUSTOM_CONF === 'true') {
    if (!fs.existsSync(CUSTOM_CONF_PATH)) {
        console.log(`Error: CUSTOM_CONF is set to true but custom conf file is missing (container looks at ${CUSTOM_CONF_PATH})`);
        process.exit(1);
    }

    try {
        fs.readFileSync(CUSTOM_CONF_PATH, 'utf8');
    } catch (e) {
        console.log(`Error: CUSTOM_CONF is set to true but custom conf file is unreadable`);
        console.log('This may be a simple permissions error or an selinux error');
        console.log('Hint: if it is selinux try `sudo chcon -Rt svirt_sandbox_file_t` on the custom config file');
        console.log('\n\nDetails:');
        console.log(e);
        process.exit(1);
    }
}

const custom = tryRequire(CUSTOM_CONF_PATH) || {};
let foundHostDockerInternal = false;

if (process.env.NO_LOCALHOST_REWRITE !== 'true') {
    lodash.forOwn(custom.routes, function (route) {
        if (route.host) {
            const u = url(route.host);

            if (u.hostname.indexOf('host.docker.internal') === 0) {
                foundHostDockerInternal = true;
            }

            if (u.hostname.indexOf('localhost') === 0) {
                u.set('hostname', localhost);
                route.host = u.toString();
            }
        }
    });

    if (foundHostDockerInternal) {
        console.log();
        console.log('Warning: the usage of host.docker.internal in your overide config is deprecated');
        console.log('The proxy container will substitute localhost -> host.docker.internal for you');
        console.log('If you really want to use this and ignore this warning rerun with NO_LOCALHOST_REWRITE=true');
        console.log('This will be an error in 3.2.x');
        console.log();
    }
}

const ret = lodash.defaultsDeep(custom, defaults);

console.log('#################################');
console.log(`# Insights Proxy version: ${require('./package.json').version} #`);
console.log('#################################');

console.log('\nUsing this Spandx config:');
console.log(ret);

console.log('\nFor more info see: https://github.com/redhataccess/spandx\n');

process.on('SIGINT', function() {
    process.exit();
});

module.exports = ret;
