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
	databaseURL: PEO.DATABASE_URL,
	// plans limits
	limitBasic: PEO.MONTHLY_LIMIT_BASIC || 10,
	limitAdvance: PEO.MONTHLY_LIMIT_ADVANCE || 15
};


// http codes
const http = {
	CODE_200: 200, CODE_201: 201,
	CODE_400: 400, CODE_401: 401, CODE_403: 403, CODE_404: 404, CODE_429: 429,
	CODE_500: 500
};

// logger
const logger = {
	// messages
	MESSAGE_NO_DATA: "No data found!",
	MESSAGE_ADD_KEY: "Please add API key!",
	MESSAGE_INVALID_KEY: "Invalid API key!",
	MESSAGE_TOO_MANY_REQUESTS: "Too many requests.",
	MESSAGE_ORG_FETCHED: "Organization details fetched successfully!",
	MESSAGE_ORG_REGISTERED: "Organization registered successfully!",
	MESSAGE_ORG_LIST: "Organization list fetched successfully!",
	MESSAGE_UNKNOWN_PLAN: "Unknown subscription plan! Please enter the correct plan.",
	MESSAGE_INTERNAL_ERROR: "Something went wrong. An error has occurred.",

	// errors
	ERROR_DB_OCCURRED: "Database error found!\n",
	ERROR_SERVER_NOT_STARTED: "Failed to start server!\n",

	// info
	INFO_SERVER_START: (port) => `🚀 Server listening on port: ${port}`
};


// set custom limit and get plans
const plans = { "basic": variables.limitBasic, "advance": variables.limitAdvance, "custom": 0 };
const allSubPlans = (limit) => {
	// set custom limit
	plans.custom = limit;
	return plans;
};



module.exports = { variables, http, logger, allSubPlans };