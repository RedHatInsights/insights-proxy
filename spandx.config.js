/*global module, process, require*/

const tryRequire = require('try-require');
const lodash = require('lodash');
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const protocol = (process.env.SSL === 'true') ? 'https' : 'http';
const port = process.env.port || 9000;

const defaults = {
    bs: {
        https: {
            key:  '/ssl/key.pem',
            cert: '/ssl/cert.pem'
        }
    },
    host: process.env.SPANDX_HOST || 'prod.foo.redhat.com',
    port: 1337,
    open: false,
    startPath: '/',
    verbose: true,
    routes: {}
};

if (process.env.LOCAL_API === 'true') {
    defaults.routes['/r/insights'] = { host: `https://${localhost}:9001` };
}

if (process.env.LOCAL_CHROME === 'true') {
    defaults.routes['/insights/chrome'] = '/chrome/';
    defaults.routes['/insightsbeta/chrome'] = '/chrome/';
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
