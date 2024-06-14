const { Pool } = require("pg");							// postgres connection pool
// environment
const projectEnvironment = require("../environment");	// util - environment


/////////////////////////
//   create new pool   //
/////////////////////////

// create postgres pool
const pool = new Pool({ connectionString: projectEnvironment.variables.databaseURL });


/////////////////////////
//       on error      //
/////////////////////////

pool.on("error", (err) => {
	console.error("failed to connect database!\n", err);
});



module.exports = pool;