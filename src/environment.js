require("dotenv").config();     // environment variables


/////////////////////////
//    env variables    //
/////////////////////////

// extract environment object from process
const PEO = process.env;

// set variables
const variables = {
	// application
	port: PEO.PORT || 8080,
	// database
	databaseURL: PEO.DATABASE_URL
};



module.exports = { variables };