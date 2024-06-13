const { Pool } = require("pg");									// postgres connection pool
// services
const serviceEnvironment = require("../services/environment");	// service - environment


/////////////////////////
//   create new pool   //
/////////////////////////

// create postgres pool
const pool = new Pool({ connectionString: serviceEnvironment.variables.databaseURL });


/////////////////////////
//       on error      //
/////////////////////////

pool.on("error", (err) => {
	console.error("failed to connect database!\n", err);
});



module.exports = pool;