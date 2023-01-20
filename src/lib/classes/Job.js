const RCCService = require("./RCCService.js")
const soap = require("soap")

class Job extends RCCService {
	constructor(id, port, expirationInSeconds = 10, category = 0, cores = 1) {
		super(port)
		this.id = id
		this.expirationInSeconds = expirationInSeconds
		this.category = category
		this.cores = cores
	}

	async CreateClient() {
		this.client = await soap.createClientAsync(__dirname + "/../RCCService.wsdl", {}, `http://127.0.0.1:${this.port}/`)
		return this.client
	}

	async Open(script) {
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

	async Close() {
		if (!this.client) return true
		return await this.client.CloseAllJobsAsync({})
	}

	async RenewLease(expirationInSeconds) {
		return await this.client.RenewLeaseAsync({
			jobID: this.id,
			expirationInSeconds,
		})
	}
}

module.exports = Job
