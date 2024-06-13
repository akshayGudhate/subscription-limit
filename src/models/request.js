const postgres = require("../database/pool");	// postgres pool instance
// placeholders
const request = {};								// request object


/////////////////////////
//   handle requests   //
/////////////////////////

// save new request
request.saveNewRequest = async (organizationID) => {
	let tooManyRequest = true;

	try {
		// connect for multiple statements in single transaction
		const client = await postgres.connect();

		// begin transaction and lock table for update
		await client.query("BEGIN;");
		await client.query("LOCK TABLE requests IN SHARE ROW EXCLUSIVE MODE;");

		// get request count for current month
		const requestCount = (
			await postgres.query(
				`
			SELECT COUNT(*)
			FROM requests
			WHERE 
				organization_id = $1 AND
				EXTRACT(MONTH FROM time_stamp) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP);
			`,
				[organizationID]
			)
		).rows[0].count;

		// get monthly limit
		const monthlyLimit = (
			await postgres.query(
				`
			SELECT monthly_limit
			FROM organization_subscriptions
			WHERE organization_id = $1;
			`,
				[organizationID]
			)
		).rows[0].monthly_limit;

		//
		// remaining request limit
		//
		const remainingRequestCount = (monthlyLimit - requestCount);
		if (remainingRequestCount > 0) {
			// insert new request record
			await client.query(
				`
				INSERT INTO requests(organization_id)
				VALUES ($1);
				`,
				[organizationID]
			);

			// commit transaction
			await client.query("COMMIT;");
			tooManyRequest = false;
		} else {
			// rollback
			await client.query("ROLLBACK;");
		};

		// return
		return tooManyRequest;
	} catch (err) {
		// on error rollback
		await client.query("ROLLBACK;");
		console.error(err);
		throw err;
	} finally {
		client.release();
	}
};


// get count for remaining requests
request.getRemainingRequestCount = async (organizationID) => {
	// get request count for current month
	const requestCount = (
		await postgres.query(
			`
			SELECT COUNT(*)
			FROM requests
			WHERE 
				organization_id = $1 AND
				EXTRACT(MONTH FROM time_stamp) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP);
			`,
			[organizationID]
		)
	).rows[0].count;

	// get monthly limit
	const monthlyLimit = (
		await postgres.query(
			`
			SELECT monthly_limit
			FROM organization_subscriptions
			WHERE organization_id = $1;
			`,
			[organizationID]
		)
	).rows[0].monthly_limit;

	// return result
	return (monthlyLimit - requestCount);
};



module.exports = request;