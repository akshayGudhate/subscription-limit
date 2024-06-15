// models
const modelDashboard = require("../models/dashboard");          // model - dashboard
// utils
const responseHandler = require("../utils/responseHandler");    // util - response handler


///////////////////////
//  admin dashboard  //
///////////////////////

const adminDashboard = async (_req, res) => {
    try {
        // get organization list
        const organizationList = (await modelDashboard.getOrganizationListWithRequestDetails()).rows;

        // check for the data
        if (organizationList.length == 0) {
            // send http response
            return responseHandler(res, 404, "No data found!", []);
        };

        // send http response
        return responseHandler(res, 200, "Organization list fetched successfully!", organizationList);
    } catch (err) {
        // send http response
        return responseHandler(res, 500, "Something went wrong. An error has occurred.", null, err);
    }
};



module.exports = { adminDashboard };