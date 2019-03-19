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

const PORTAL_BACKEND_MARKER = 'PORTAL_BACKEND_MARKER';

const keycloakPubkeys = {
    prod:  fs.readFileSync(__dirname + '/certs/keycloak.prod.cert',  'utf8'),
    stage: fs.readFileSync(__dirname + '/certs/keycloak.stage.cert', 'utf8'),
    qa:    fs.readFileSync(__dirname + '/certs/keycloak.qa.cert',    'utf8')
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
            const user = decoded.identity;
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

const CUSTOM_CONF_PATH = '/config/spandx.config.js';

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
const ret = lodash.defaultsDeep(custom, defaults);

console.log('\n');
console.log('### USING SPANDX CONFIG ###');
console.log(ret);
console.log('###########################');
console.log('For more info see: https://github.com/redhataccess/spandx');
console.log(`Insights Proxy version: ${require('./package.json').version}`);
console.log('\n');

process.on('SIGINT', function() {
    process.exit();
});

module.exports = ret;
