const router = require("express").Router();             // express router
// models
const modelDashboard = require("../models/dashboard");  // model - dashboard


///////////////////////
//  admin dashboard  //
///////////////////////

router.get(
    "/",
    async (_req, res) => {
        try {
            // save new review
            const organizationList = (await modelDashboard.getOrganizationListWithRequestDetails()).rows;

            // check for the data
            if (organizationList.length == 0) {
                return res.status(404).json({
                    info: "No data found!",
                    data: []
                });
            };

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