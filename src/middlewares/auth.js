// models
const modelOrganization = require("../models/organization");	// model - organization
const modelRequest = require("../models/request");				// model - request
// utils
const responseHandler = require("../utils/responseHandler");	// util - response handler


//////////////////////////
//    check validity    //
//////////////////////////

const validateAPIKey = async (req, res, next) => {
	//
	// parse request details
	//
	const apiKey = req.headers['x-api-key'];

	//
	// validate key
	//
	try {
		if (!apiKey) {
			// send http response
			return responseHandler(res, 401, "Please add API key!");
		};

		// get organization details by api key
		const resultOrganizationDetails = await modelOrganization.getOrganizationDetailsByKey(apiKey);

		//
		// if invalid
		//
		if (resultOrganizationDetails.rowCount == 0) {
			// send http response
			return responseHandler(res, 403, "Invalid add API key!");
		}

		//
		// if valid then next
		//
		const organizationDetails = resultOrganizationDetails.rows[0];
		const remainingRequestCount = await modelRequest.getRemainingRequestCount(organizationDetails.organization_id);

		// check request monthly limit
		if (remainingRequestCount && remainingRequestCount == 0) {
			// send http response
			return responseHandler(res, 429, "Too many requests.");
		};

		// attach organization details to request object
		req.organization = organizationDetails;
		req.remainingRequestCount = remainingRequestCount;

		// propagate request
		next();
	} catch (err) {
		// send http response
		return responseHandler(res, 500, "Something went wrong. An error has occurred.", null, err);
	}
};



module.exports = { validateAPIKey };