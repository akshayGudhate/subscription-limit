const postgres = require("./pool");		// postgres pool instance
// placeholders
const organization = {};				// organization object


/////////////////////////
//        tables       //
/////////////////////////

// organizations table
organization.initTableOrganizations = async () => {
	try {
		await postgres.query(
			`
            CREATE TABLE IF NOT EXISTS organizations(
			    organization_id	SERIAL 		PRIMARY KEY,
    			name 			TEXT 					NOT NULL,
				email			TEXT		UNIQUE		NOT NULL,
                time_stamp		TIMESTAMPTZ				DEFAULT NOW()
            );
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};


// organization subscriptions
organization.initTableOrganizationSubscriptions = async () => {
	try {
		await postgres.query(
			`
            CREATE TABLE IF NOT EXISTS organization_subscriptions(
			    subscription_id		SERIAL 		PRIMARY KEY,
				organization_id 	INT 		REFERENCES organizations(organization_id),
				api_key 			TEXT 		UNIQUE 			NOT NULL,
				subscription_plan 	TEXT 						NOT NULL 		CHECK(subscription_plan IN('basic', 'advance', 'custom')),
				monthly_limit 		INT 						NOT NULL		CHECK(monthly_limit >= 0)
            );
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};


// view for organization subscriptions details
organization.initViewOrganizationSubscriptionDetails = async () => {
	try {
		await postgres.query(
			`
            CREATE OR REPLACE VIEW view_organization_subscription_details AS(
				SELECT
					o.organization_id,
					o.name,
					o.email,
					os.subscription_plan,
					os.api_key,
					os.monthly_limit,
					o.time_stamp
				FROM organizations o
				LEFT JOIN organization_subscriptions os
				ON o.organization_id = os.organization_id
			);
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};



module.exports = organization;