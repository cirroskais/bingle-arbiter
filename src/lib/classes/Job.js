const soap = require("soap")
const { randomUUID } = require("crypto")

const RCCService = require("./RCCService.js")
const logger = require("../logger.js")

class Job extends RCCService {
	constructor({ id = randomUUID(), expirationInSeconds = 10, category = 0, cores = 1 } = {}) {
		super()
		this.id = id
		this.expirationInSeconds = expirationInSeconds
		this.category = category
		this.cores = cores
	}

	async CreateClient() {
		this.client = await soap.createClientAsync(__dirname + "/../RCCService.wsdl", {}, `http://127.0.0.1:${this.port}/`)
		return this.client
	}

	async OpenJobEx(script) {
		if (!this.client) throw new Error("There is no client")
		return await this.client.OpenJobExAsync({
			job: {
				id: this.id,
				expirationInSeconds: this.expirationInSeconds,
				category: this.category,
				cores: this.cores,
			},
			script,
		})
	}

	async CloseJob() {
		if (!this.client) return true
		return await this.client.CloseJobAsync({ jobID: this.id })
	}

	async RenewLease(expirationInSeconds) {
		if (!this.client) throw new Error("There is no client")
		logger.info(`[${this.id}] Job renewed to ${expirationInSeconds} seconds`)
		return await this.client.RenewLeaseAsync({ jobID: this.id, expirationInSeconds })
	}

	async Execute(name, script) {
		if (!this.client) throw new Error("There is no client")
		return await this.client.ExecuteAsync({ jobID: this.id, script: { name, script, arguments: {} } })
	}
}

module.exports = Job
