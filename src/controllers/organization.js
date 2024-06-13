const router = require("express").Router();         			// express router
// models
const modelOrganization = require("../models/organization");	// model - organization
// services
const serviceAPIKey = require("../services/apiKey");			// service - api key


//////////////////////
//   organization   //
//////////////////////

router.post(
	"/",
	async (req, res) => {
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
					return res.status(400).json({
						info: "Unknown subscription plan! Please enter correct plan.",
						data: null
					});
			};

			//
			// TODO: hash and then store api key
			//

			// save new review
			const organizationID = (
				await modelOrganization.registerOrganization(name, email, apiKey, subscriptionPlan, monthlyLimit)
			).rows[0].organization_id;

			return res.status(200).json({
				info: "Organization registered successfully!",
				data: { organizationID, apiKey }
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