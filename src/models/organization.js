const postgres = require("../database/pool");   // postgres pool instance
// placeholders
const organization = {};                        // organization object


// register organization
organization.registerOrganization = (name, email, apiKey, subscriptionPlan, monthlyLimit) => postgres.query(
    `
	WITH new_organization AS (
        INSERT INTO organizations(name, email)
        VALUES ($1, $2)
        RETURNING organization_id
    )
    INSERT INTO organization_subscriptions(organization_id, api_key, subscription_plan, monthly_limit)
    SELECT new_organization.organization_id, $3, $4, $5
    FROM new_organization
    RETURNING organization_id;
	`,
    [name, email, apiKey, subscriptionPlan, monthlyLimit]
);


// check api key exist or not
organization.getOrganizationDetailsByKey = (apiKey) => postgres.query(
    `
	SELECT *
    FROM view_organization_subscription_details
    WHERE api_key = $1;
	`,
    [apiKey]
);



module.exports = organization;