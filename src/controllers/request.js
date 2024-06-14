// models
const modelRequest = require("../models/request");				// model - request
// utils
const responseHandler = require("../utils/responseHandler");	// util - response handler


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
			return res.status(429).json({
				info: "Too many requests.",
				data: null
			});
		};

		// send http response
		return responseHandler(res, 200, "Organization details fetched successfully!", {
			organizationID: organizationDetails.organization_id,
			organizationName: organizationDetails.name,
			organizationEmail: organizationDetails.email,
			subscriptionPlan: organizationDetails.subscription_plan,
			monthlyRequestLimit: organizationDetails.monthly_limit,
			remainingRequestCount: parseInt(req.remainingRequestCount) - 1
		});
	} catch (err) {
		// send http response
		return responseHandler(res, 500, "Something went wrong. An error has occurred.", null, err);
	}
};



module.exports = { handleRequest };