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

		// send error if invalid plan
		if (!["basic", "advance", "custom"].includes(subscriptionPlan)) {
			// send http response
			return responseHandler(res, 400, "Unknown subscription plan! Please enter the correct plan.");
		}
		// created limit object
		const getMonthlyLimitObject = { "basic": 10, "advance": 15, "custom": limit };

		// get api key
		const apiKeyActual = utilityApiKey.generateApiKey();
		const apiKeyHashed = serviceHashing.getHashed(apiKeyActual);

		// save organization details
		const organizationID = (
			await modelOrganization.registerOrganization(
				name, email, apiKeyHashed, subscriptionPlan, getMonthlyLimitObject[subscriptionPlan]
			)
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