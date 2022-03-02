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
// const code = 400;
// console.log(code);
// console.log(!Object.keys(table).includes(code.toString()));


function stat(code, ...args) {
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

	let msg = '';
	if (args.length > 0) {
		msg = ': ' + args.join(' ');
	}

	if (!Object.keys(table).includes(code.toString())) {
		return {
			status: code,
			msg: 'Unknown status code' + msg
		}
	} else {
		return {
			status: code,
			msg: table[code.toString()] + msg
		}
	}
}

console.log(stat(500, 'created'));

