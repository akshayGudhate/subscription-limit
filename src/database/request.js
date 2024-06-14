const postgres = require("./pool");		// postgres pool instance
// placeholders
const request = {};						// request object


/////////////////////////
//        tables       //
/////////////////////////

// requests table
request.initTableRequests = async () => {
	try {
		await postgres.query(
			`
            CREATE TABLE IF NOT EXISTS requests(
			    request_id		SERIAL 		PRIMARY KEY,
				organization_id INT 		REFERENCES organizations(organization_id),
				time_stamp 		TIMESTAMP 				DEFAULT NOW()
            );
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};


// index to optimize request count queries
request.initIndexRequestCount = async () => {
	try {
		await postgres.query(
			`
            CREATE INDEX IF NOT EXISTS idx_organization_request_count
			ON requests(organization_id, time_stamp);
            `
		);
	} catch (err) {
		// throw error
		throw err;
	}
};



module.exports = request;