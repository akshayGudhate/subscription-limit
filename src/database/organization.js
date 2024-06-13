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
				email			TEXT					NOT NULL,
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
				monthly_limit 		INT 						NOT NULL,
                time_stamp			TIMESTAMPTZ					DEFAULT NOW()
            );
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};



module.exports = organization;