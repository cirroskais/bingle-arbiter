const chalk = require("chalk")

const logger = {
	info: (_) => console.log(chalk.blue("[info]"), _),
	success: (_) => console.log(chalk.green("[success]"), _),
	warn: (_) => console.log(chalk.yellow("[warn]"), _),
	error: (_) => console.log(chalk.red("[error]"), _),
}

module.exports = logger
