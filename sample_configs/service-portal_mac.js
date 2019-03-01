// This is a sample config for the following scenario
// Service Portal app running locally on your Mac OS
// The Insights UI running in the Dev CI cluster
module.exports = {
    routes: {
        '/r/insights/platform/service-portal': { host: 'http://host.docker.internal:5000' },
        '/insights': { host:  'https://access.ci.cloud.paas.upshift.redhat.com' }
    }
};
