// models
const modelOrganization = require("../models/organization");	// model - organization
const modelRequest = require("../models/request");				// model - request


//////////////////////////
//    check validity    //
//////////////////////////

// validate webhook signature
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
			return res.status(401).json({
				info: "Please add API key!",
				data: null
			});
		};

		// get organization details by api key
		const resultOrganizationDetails = await modelOrganization.getOrganizationDetailsByKey(apiKey);

		//
		// if invalid
		//
		if (resultOrganizationDetails.rowCount == 0) {
			return res.status(403).json({
				info: "Invalid add API key!",
				data: null
			});
		}

		//
		// if valid then next
		//
		const organizationDetails = resultOrganizationDetails.rows[0];
		const remainingRequestCount = await modelRequest.getRemainingRequestCount(organizationDetails.organization_id);

		// check request monthly limit
		if (remainingRequestCount && remainingRequestCount == 0) {
			return res.status(429).json({
				info: "Too may requests.",
				data: null
			});
		};

		// attach organization details to request object
		req.organization = organizationDetails;
		req.remainingRequestCount = remainingRequestCount;

		// propagate request
		next();
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			info: "Something went wrong. An error has occurred.",
			data: null
		});
	}
};




module.exports = { validateAPIKey };