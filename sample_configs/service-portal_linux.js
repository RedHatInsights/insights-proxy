// This is a sample config file for the following scenario
// You have the service portal running locally on your dev machine on port 5000
// The Insights UI is running on CI dev cluster
module.exports = {
    routes: {
        '/r/insights/platform/service-portal': { host: 'http://localhost:5000' },
        '/insights': { host:  'https://access.ci.cloud.paas.upshift.redhat.com' }
    }
};
