const express = require("express");							// express server module
const helmet = require("helmet");							// set headers for better security
const compression = require("compression");					// compressed assets
const cors = require("cors");								// cors for react integration
// database
const database = require("./src/database/init");			// database
// routers
const apiRouter = require("./src/apiRouter");				// router - api
// environment
const projectEnvironment = require("./src/environment");	// environment


/////////////////////////
//         app         //
/////////////////////////

const app = express();


/////////////////////////
//     middlewares     //
/////////////////////////

app.use(
	helmet(),												// middleware - security headers
	compression(),											// middleware - compression for assets
	express.json(),											// middleware - body parser: json data
	express.urlencoded({ extended: true }),					// middleware - body parser: url-encoded data
	cors()													// middleware - cors for react integration
);


/////////////////////////
//     start server    //
/////////////////////////

const startServer = async () => {
	try {
		// initialize database
		await database.initDatabase();						// database - init

		// api routes
		app.use("/api/v1", apiRouter);						// router - api version-1

		// register http listener
		app.listen(projectEnvironment.variables.port, () => {
			console.info(`🚀 Server listening on port: ${projectEnvironment.variables.port}`);
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