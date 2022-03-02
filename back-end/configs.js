import mysql from 'mysql2';


export const hashSettings = {
	iterations: Number(process.env.HASH_ITERATIONS),
	keylen: Number(process.env.HASH_KEYLEN),
	digest: process.env.HASH_DIGEST,
	encoding: process.env.HASH_ENCODING
};

export const DB_options = {
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT || 3310),
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || 'root',
	database: process.env.DB_DATABASE || 'mnd',
	connectionLimit: Number(process.env.DB_CONNLIMIT || 30)
};

const DB_pool = mysql.createPool(DB_options);
const DB_promisePool = DB_pool.promise();

export { DB_promisePool };


export function statusJson(code, msg) {
	const table = {
		'200': 'OK',
		'201': 'Created',
		'400': 'Bad Request',
		'401': 'Unauthorized',
		'403': 'Forbidden',
		'404': 'Not Found',
		'409': 'Conflict',
		'500': 'Internal Server Error',
	};
	return {
		status: code,
		msg: msg
	}
}

export function Err(msg) {
	return statusJson(401, msg);
}