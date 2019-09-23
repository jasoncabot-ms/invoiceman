const auth = require("@azure/ms-rest-nodeauth");

const {
    BillingManagementClient
} = require("@azure/arm-billing");

const config = {
    "TenantDomain": process.env["TenantDomain"],
    "SubscriptionID": process.env["SubscriptionID"],
    "ClientID": process.env["ClientID"],
    "ClientSecret": process.env["ClientSecret"]
};

const success = (context, client) => {
    client.invoices.list().then((invoices) => {
        context.res = {
            body: {
                apiVersion: client.apiVersion,
                subscriptionId: client.subscriptionId,
                invoices: invoices
            }
        };
        context.done();
    }).catch((err) => failure(context, err));
}

const failure = (context, error) => {
    context.done(null, {
        res: {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: error.body
        }
    });
}

module.exports = function (context, req) {
    auth.loginWithServicePrincipalSecret(config.ClientID, config.ClientSecret, config.TenantDomain)
        .then((creds) => {
            const client = new BillingManagementClient(creds, config.SubscriptionID);
            success(context, client);
        });
};
