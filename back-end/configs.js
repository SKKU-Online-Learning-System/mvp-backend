import mysql from 'mysql2';

// console.log('config is loaded!');

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
	return {
		statusCode: code,
		msg: msg
	}
}

export function Err(msg) {
	return statusJson(401, msg);
}

