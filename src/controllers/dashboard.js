const router = require("express").Router();         			// express router
// models
const modelDashboard = require("../models/dashboard");	// model - dashboard
// services
const serviceAPIKey = require("../services/apiKey");			// service - api key


///////////////////////
//  admin dashboard  //
///////////////////////

router.get(
    "/",
    async (req, res) => {
        try {
            // save new review
            const organizationList = (await modelDashboard.getOrganizationListWithRequestDetails()).rows;

            return res.status(200).json({
                info: "Organization list fetched successfully!",
                data: organizationList
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