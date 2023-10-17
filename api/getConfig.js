//env vars
module.exports = (req, res) => {
    res.json({
        GCDomain: process.env.GC_DOMAIN,
        GCEnvironment: process.env.GC_ENVIRONMENT,
        GCMessagingDeplId: process.env.GC_MESSAGING_DEPLOYMENT_ID,       
        directToWM: process.env.DIRECT_TO_WM
    });
};
