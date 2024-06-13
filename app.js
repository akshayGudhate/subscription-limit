const express = require("express");									// express server module
const helmet = require("helmet");									// set headers for better security
const compression = require("compression");							// compressed assets
const cors = require("cors");										// cors for react integration
// services
const serviceEnvironment = require("./src/services/environment");	// service - environment
//
// TODO: add database and routes
// 


/////////////////////////
//         app         //
/////////////////////////

const app = express();


/////////////////////////
//     middlewares     //
/////////////////////////

app.use(
	helmet(),														// middleware - security headers
	compression(),													// middleware - compression for assets
	express.json(),													// middleware - body parser: json data
	express.urlencoded({ extended: true }),							// middleware - body parser: url-encoded data
	cors()															// middleware - cors for react integration
);


/////////////////////////
//     start server    //
/////////////////////////

const startServer = async () => {
	try {
		//
		// TODO: initialize database
		// 

		//
		// TODO: api routes
		//


		//
		// register http listener
		//
		app.listen(serviceEnvironment.variables.port, () => {
			console.info(`🚀 Server listening on port: ${serviceEnvironment.variables.port}`);
		});
	} catch (err) {
		// error
		console.error("Server failed to start!!", err);
	}
};


//
// call start server
//
startServer();