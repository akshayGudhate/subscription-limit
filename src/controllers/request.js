// models
const modelRequest = require("../models/request");				// model - request
// utils
const responseHandler = require("../utils/responseHandler");	// util - response handler
// environment
const projectEnv = require("../environment");					// environment


////////////////////////
//   handle request   //
////////////////////////

const handleRequest = async (req, res) => {
	try {
		// extract details
		const organizationDetails = req.organization;

		// add request
		const tooManyRequest = await modelRequest.saveNewRequest(organizationDetails.organization_id);
		if (tooManyRequest) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_429, projectEnv.logger.MESSAGE_TOO_MANY_REQUESTS);
		};

		// send http response
		return responseHandler(res, projectEnv.http.CODE_200, projectEnv.logger.MESSAGE_ORG_FETCHED, {
			organizationID: organizationDetails.organization_id,
			organizationName: organizationDetails.name,
			organizationEmail: organizationDetails.email,
			subscriptionPlan: organizationDetails.subscription_plan,
			monthlyRequestLimit: organizationDetails.monthly_limit,
			remainingRequestCount: parseInt(req.remainingRequestCount) - 1
		});
	} catch (err) {
		// send http response
		return responseHandler(res, projectEnv.http.CODE_500, projectEnv.logger.MESSAGE_INTERNAL_ERROR, null, err);
	}
};



module.exports = { handleRequest };