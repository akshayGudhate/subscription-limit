// models
const modelOrganization = require("../models/organization");	// model - organization
// utils
const serviceAPIKey = require("../utils/apiKey");				// util - api key
const responseHandler = require("../utils/responseHandler");	// util - response handler


//////////////////////
//   organization   //
//////////////////////

const registerOrganization = async (req, res) => {
	try {
		// parse details
		const { name, email, subscriptionPlan, limit } = req.body;
		// get api key
		const apiKey = serviceAPIKey.generateAPIKey();

		// set limit
		let monthlyLimit;
		switch (subscriptionPlan) {
			case "basic":
				monthlyLimit = 10;
				break;
			case 'advance':
				monthlyLimit = 15;
				break;
			case 'custom':
				monthlyLimit = limit;
				break;
			default:
				// send http response
				return responseHandler(res, 400, "Unknown subscription plan! Please enter the correct plan.");
		};

		//
		// TODO: hash and then store api key
		//

		// save new review
		const organizationID = (
			await modelOrganization.registerOrganization(name, email, apiKey, subscriptionPlan, monthlyLimit)
		).rows[0].organization_id;

		// send http response
		return responseHandler(res, 201, "Organization registered successfully!", { organizationID, apiKey });
	} catch (err) {
		// send http response
		return responseHandler(res, 500, "Something went wrong. An error has occurred.", null, err);
	}
};



module.exports = { registerOrganization };