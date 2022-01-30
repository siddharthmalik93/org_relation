let { Pool } = require('pg');

let { InternalServerError } = require('../utils/error_handler');


let pool = new Pool({
	max: 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

pool.on('error', (err, _client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})

async function init_tables(cb) {
	try {
		let org_table =
			`CREATE TABLE organization(
				self_org_id SERIAL PRIMARY KEY,
				org_name text NOT NULL UNIQUE
			)`;
		let org_relation_table =
			`CREATE TABLE organization_relation(
				self_org_id integer NOT NULL,
				parent_org_id integer NOT NULL,
				PRIMARY KEY (self_org_id, parent_org_id)
			)`;

		await get(org_table).catch(e => {
			// table already exist code
			if (e.code != '42P07') throw e;
		});

		await get(org_relation_table).catch(e => {
			// table already exist code
			if (e.code != '42P07') throw e;
		});

		console.log('Database tables created!');
	} catch (err) {
		cb(err);
	}
}

async function get(sqlQuery) {
	let db_conn = await pool.connect();
	let res = await db_conn.query(sqlQuery);

	db_conn.release();
	return res.rows;
}

module.exports = {
	pool,
	get,
	init_tables,
};
