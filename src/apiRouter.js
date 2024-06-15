const router = require("express").Router();                             // express router
// controllers
const controllerOrganization = require("./controllers/organization");   // controller - organization
const controllerRequest = require("./controllers/request");             // controller - request
const controllerDashboard = require("./controllers/dashboard");         // controller - dashboard
// middlewares
const middlewareAuth = require("./middlewares/auth");			        // middleware - auth


////////////////////////
//   handle routers   //
////////////////////////

// route - organization
router.post("/organization", controllerOrganization.registerOrganization);

// route - request	            
router.get("/request", middlewareAuth.validateApiKey, controllerRequest.handleRequest);

// route - dashboard
router.get("/dashboard", controllerDashboard.adminDashboard);



module.exports = router;