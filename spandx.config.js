/*global module, process, require*/

const tryRequire = require('try-require');
const lodash = require('lodash');

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

    routes: {
        '/r/insights': { host: 'https://access.redhat.com' },
        '/': { host: 'https://localhost:9000' }
    }
};

const custom = tryRequire('/config/spandx.config') || {};
const ret = lodash.defaultsDeep(custom, defaults);

console.log('\n');
console.log('### USING SPANDX CONFIG ###');
console.log(ret);
console.log('###########################');
console.log('For more info see: https://github.com/redhataccess/spandx');
console.log('\n');

module.exports = ret;
