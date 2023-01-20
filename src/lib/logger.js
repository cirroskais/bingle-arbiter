const chalk = require("chalk")

const logger = {
	// Omg just like tadah :D (Tadahjak face)
	boot: (_) => console.log(chalk.greenBright("[BOOT]"), _),
	info: (_) => console.log(chalk.blue("[INFO]"), _),
	success: (_) => console.log(chalk.green("[SUCCESS]"), _),
	warn: (_) => console.log(chalk.yellow("[WARN]"), _),
	error: (_) => console.log(chalk.red("[ERROR]"), _),
}

module.exports = logger
