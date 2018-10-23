/*global module, process, require*/

const tryRequire = require('try-require');
const lodash = require('lodash');
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const protocol = (process.env.SSL === 'true') ? 'https' : 'http';
const port = process.env.PORT || 8002;
let envEndpoint = 'https://access.redhat.com'

const defaults = {
    bs: {
        https: {
            key:  '/ssl/key.pem',
            cert: '/ssl/cert.pem'
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

if (process.env.CI_ENV === 'true') {
    envEndpoint = 'https://access.ci.itop.redhat.com'
}
if (process.env.QA_ENV === 'true') {
    envEndpoint = 'https://access.qa.itop.redhat.com'
}
if (process.env.STAGE_ENV === 'true') {
    envEndpoint = 'https://access.stage.itop.redhat.com'
}

if (process.env.LOCAL_API === 'true') {
    defaults.routes['/r/insights'] = { host: `https://${localhost}:9001` };
}

if (process.env.LOCAL_CHROME === 'true') {
    defaults.routes['/insights/static/chrome']     = '/chrome/';
    defaults.routes['/insightsbeta/static/chrome'] = '/chrome/';
} else {
    defaults.routes['/insights/static/chrome']     = { host: envEndpoint };
    defaults.routes['/insightsbeta/static/chrome'] = { host: envEndpoint };
}

defaults.routes['/insights'] = { host: `${protocol}://${localhost}:${port}` };
defaults.routes['/'] = { host: envEndpoint };

const custom = tryRequire('/config/spandx.config') || {};
const ret = lodash.defaultsDeep(custom, defaults);

console.log('\n');
console.log('### USING SPANDX CONFIG ###');
console.log(ret);
console.log('###########################');
console.log('For more info see: https://github.com/redhataccess/spandx');
console.log('\n');

module.exports = ret;
