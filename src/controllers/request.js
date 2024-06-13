const router = require("express").Router();         	// express router
// models
const modelRequest = require("../models/request");		// model - request
// middlewares
const middlewareAuth = require("../middlewares/auth");	// middleware - auth


////////////////////////
//   handle request   //
////////////////////////

router.get(
	"/",
	// middleware for validate api key
	middlewareAuth.validateAPIKey,
	async (req, res) => {
		try {
			// extract details
			const organizationDetails = req.organization;

			// add request
			const tooManyRequest = await modelRequest.saveNewRequest(organizationDetails.organization_id);
			if (tooManyRequest) {
				return res.status(429).json({
					info: "Too may requests.",
					data: null
				});
			}

			return res.status(200).json({
				info: "Organization details fetched successfully!",
				data: {
					organizationID: organizationDetails.organization_id,
					organizationName: organizationDetails.name,
					organizationEmail: organizationDetails.email,
					subscriptionPlan: organizationDetails.subscription_plan,
					monthlyRequestLimit: organizationDetails.monthly_limit,
					remainingRequestCount: parseInt(req.remainingRequestCount) - 1
				}
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				info: "Something went wrong. An error has occurred.",
				data: null
			});
		}
	}
);



module.exports = router;