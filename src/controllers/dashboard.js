// models
const modelDashboard = require("../models/dashboard");          // model - dashboard
// utils
const responseHandler = require("../utils/responseHandler");    // util - response handler
// environment
const projectEnv = require("../environment");					// environment


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
            return responseHandler(res, projectEnv.http.CODE_404, projectEnv.logger.MESSAGE_NO_DATA, []);
        };

        // send http response
        return responseHandler(res, projectEnv.http.CODE_200, projectEnv.logger.MESSAGE_ORG_LIST, organizationList);
    } catch (err) {
        // send http response
        return responseHandler(res, projectEnv.http.CODE_500, projectEnv.logger.MESSAGE_INTERNAL_ERROR, null, err);
    }
};



module.exports = { adminDashboard };