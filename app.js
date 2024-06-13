const express = require("express");										// express server module
const helmet = require("helmet");										// set headers for better security
const compression = require("compression");								// compressed assets
const cors = require("cors");											// cors for react integration
// database
const database = require("./src/database/init");						// database
// services
const serviceEnvironment = require("./src/services/environment");		// service - environment
// routes
const routerOrganization = require("./src/controllers/organization");	// router - organization
const routerRequest = require("./src/controllers/request");				// router - request


/////////////////////////
//         app         //
/////////////////////////

const app = express();


/////////////////////////
//     middlewares     //
/////////////////////////

app.use(
	helmet(),															// middleware - security headers
	compression(),														// middleware - compression for assets
	express.json(),														// middleware - body parser: json data
	express.urlencoded({ extended: true }),								// middleware - body parser: url-encoded data
	cors()																// middleware - cors for react integration
);


/////////////////////////
//     start server    //
/////////////////////////

const startServer = async () => {
	try {
		//
		// initialize database
		//
		await database.initDatabase();									// database - init

		//
		// api routes
		//
		app.use("/api/v1/organization", routerOrganization);			// route - organization
		app.use("/api/v1/request", routerRequest);						// route - request

		//
		// register http listener
		//
		app.listen(serviceEnvironment.variables.port, () => {
			console.info(`🚀 Server listening on port: ${serviceEnvironment.variables.port}`);
		});
	} catch (err) {
		// error
		console.error("failed to start server!\n", err);
	}
};


//
// call start server
//
startServer();