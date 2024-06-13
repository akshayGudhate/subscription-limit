const request = require("./request");				// database - request
const organization = require("./organization");		// database - organization


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

		// keys
		return request.initIndexRequestCount();

	} catch (err) {
		// throw error
		throw err;
	}
};



module.exports = { initDatabase };