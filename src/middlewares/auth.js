// models
const modelOrganization = require("../models/organization");	// model - organization
const modelRequest = require("../models/request");				// model - request
// services
const serviceHashing = require("../services/hashing");			// service - hashing
// utils
const responseHandler = require("../utils/responseHandler");	// util - response handler
// environment
const projectEnv = require("../environment");	            	// environment


//////////////////////////
//    check validity    //
//////////////////////////

const validateApiKey = async (req, res, next) => {
	// parse request details
	const userApiKey = req.headers['x-api-key'];

	//
	// validate key
	//
	try {
		if (!userApiKey) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_401, projectEnv.logger.MESSAGE_ADD_KEY);
		};

		// get organization details by id
		const [apiKeyActual, organizationID] = userApiKey.split(":");
		const resultOrganizationDetails = await modelOrganization.getOrganizationDetailsByID(organizationID);

		//
		// if invalid - wrong organization
		//
		if (resultOrganizationDetails.rowCount == 0) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_403, projectEnv.logger.MESSAGE_INVALID_KEY);
		}

		const organizationDetails = resultOrganizationDetails.rows[0];
		// check actual api key with stored hashed api key
		const isOrganizationAndApiKeyMatching = serviceHashing.isHashMatching(apiKeyActual, organizationDetails.api_key);

		//
		// if invalid - wrong apiKeyActual
		//
		if (!isOrganizationAndApiKeyMatching) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_403, projectEnv.logger.MESSAGE_INVALID_KEY);
		}

		//
		// if valid api key
		//
		const remainingRequestCount = await modelRequest.getRemainingRequestCount(organizationID);
		// check request monthly limit
		if (remainingRequestCount && remainingRequestCount == 0) {
			// send http response
			return responseHandler(res, projectEnv.http.CODE_429, projectEnv.logger.MESSAGE_TOO_MANY_REQUESTS);
		};

		// attach organization details to request object
		req.organization = organizationDetails;
		req.remainingRequestCount = remainingRequestCount;

		// propagate request
		next();
	} catch (err) {
		// send http response
		return responseHandler(res, projectEnv.http.CODE_500, projectEnv.logger.MESSAGE_INTERNAL_ERROR, null, err);
	}
};



module.exports = { validateApiKey };