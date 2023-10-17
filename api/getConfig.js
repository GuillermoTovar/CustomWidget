//env vars
module.exports = (req, res) => {
    res.json({
        GCDomain: process.env.GC_DOMAIN,
        GCMessagingDeplId: process.env.GC_MESSAGING_DEPLOYMENT_ID
    });
};
