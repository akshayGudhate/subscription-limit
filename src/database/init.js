const organization = require("./organization");		// database - organization
const request = require("./request");				// database - request


/////////////////////////
//   initialization    //
/////////////////////////

const initDatabase = async () => {
	try {

		//////////////////////////
		//        tables        //
		//////////////////////////

		// organization
		await organization.initTableOrganizations();
		await organization.initTableOrganizationSubscriptions();
		// request
		await request.initTableRequests();

		//////////////////////////
		//        indexes       //
		//////////////////////////

		// request count
		await request.initIndexRequestCount();

		//////////////////////////
		//         views        //
		//////////////////////////

		// request count
		return organization.initViewOrganizationSubscriptionDetails();

	} catch (err) {
		// throw error
		throw err;
	}
};



module.exports = { initDatabase };