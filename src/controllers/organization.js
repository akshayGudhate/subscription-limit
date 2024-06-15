// models
const modelOrganization = require("../models/organization");	// model - organization
// services
const serviceHashing = require("../services/hashing");			// service - hashing
// utils
const utilityApiKey = require("../utils/apiKey");				// util - api key
const responseHandler = require("../utils/responseHandler");	// util - response handler


//////////////////////
//   organization   //
//////////////////////

const registerOrganization = async (req, res) => {
	try {
		// parse details
		const { name, email, subscriptionPlan, limit } = req.body;
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

		// get api key
		const apiKeyActual = utilityApiKey.generateApiKey();
		const apiKeyHashed = serviceHashing.getHashed(apiKeyActual);

		// save organization details
		const organizationID = (
			await modelOrganization.registerOrganization(name, email, apiKeyHashed, subscriptionPlan, monthlyLimit)
		).rows[0].organization_id;

		// append organizationID in apiKey
		const userApiKey = `${apiKeyActual}:${organizationID}`;

		// send http response
		return responseHandler(res, 201, "Organization registered successfully!", { organizationID, apiKey: userApiKey });
	} catch (err) {
		// send http response
		return responseHandler(res, 500, "Something went wrong. An error has occurred.", null, err);
	}
};



module.exports = { registerOrganization };