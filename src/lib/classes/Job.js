const RCCService = require("./RCCService.js")

class Job extends RCCService {
	constructor(id, expirationInSeconds = 10, category = 0, cores = 1) {
		super()
	}
}

module.exports = Job
