// models
const modelOrganization = require("../models/organization");	// model - organization
// services
const serviceHashing = require("../services/hashing");			// service - hashing
// utils
const utilityApiKey = require("../utils/apiKey");				// util - api key
const responseHandler = require("../utils/responseHandler");	// util - response handler
// environment
const projectEnv = require("../environment");					// environment


//////////////////////
//   organization   //
//////////////////////

const registerOrganization = async (req, res) => {
	try {
		// parse details
		const { name, email, subscriptionPlan, limit } = req.body;

		// get subscription plan limits
		const monthlyLimits = projectEnv.allSubPlans(limit);
		// send error if invalid plan
		if (!(subscriptionPlan in monthlyLimits)) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_400, projectEnv.logger.MESSAGE_UNKNOWN_PLAN);
		};

		// get api key
		const apiKeyActual = utilityApiKey.generateApiKey();
		const apiKeyHashed = serviceHashing.getHashed(apiKeyActual);

		// save organization details
		const organizationID = (
			await modelOrganization.registerOrganization(
				name, email, apiKeyHashed, subscriptionPlan, monthlyLimits[subscriptionPlan]
			)
		).rows[0].organization_id;

		// append organizationID in apiKey
		const userApiKey = `${apiKeyActual}:${organizationID}`;

		// send http response
		return responseHandler(res, projectEnv.http.CODE_201, projectEnv.logger.MESSAGE_ORG_REGISTERED, {
			organizationID, apiKey: userApiKey
		});
	} catch (err) {
		// send http response
		return responseHandler(res, projectEnv.http.CODE_500, projectEnv.logger.MESSAGE_INTERNAL_ERROR, null, err);
	}
};



module.exports = { registerOrganization };