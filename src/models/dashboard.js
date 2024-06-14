const postgres = require("../database/pool");   // postgres pool instance
// placeholders
const dashboard = {};                           // dashboard object


/////////////////////////
//      dashboard      //
/////////////////////////

// check api key exist or not
dashboard.getOrganizationListWithRequestDetails = () => postgres.query(
    `
	SELECT 
        vosd.organization_id,
        vosd.name,
        vosd.email,
        vosd.subscription_plan,
        vosd.monthly_limit,
        COUNT(r.request_id)	AS request_made,
        COALESCE(
            vosd.monthly_limit - count(r.request_id),
            vosd.monthly_limit
        ) AS request_remaining
    FROM view_organization_subscription_details vosd
    LEFT OUTER JOIN requests r
    ON r.organization_id = vosd.organization_id
    GROUP BY
        vosd.organization_id,
        vosd.name,
        vosd.email,
        vosd.subscription_plan,
        vosd.monthly_limit
    ORDER BY organization_id ASC;
    `
);



module.exports = dashboard;