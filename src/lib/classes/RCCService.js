const EventEmitter = require("events")
const child_process = require("child_process")
const logger = require(`${__dirname}\\..\\logger.js`)

class RCCService extends EventEmitter {
	constructor(port, path = process.env.RCCSERVICE_PATH) {
		super()
		this.path = path
		this.port = port
	}

	Start(options = { cwd: this.path }) {
		return new Promise((resolve, reject) => {
			try {
				this.proc = child_process.spawn("RCCService.exe", ["-Console", "-PlaceId:-1", `-Port`, port], options)
				this.proc.once("spawn", () => {
					logger.info(`Spawning RCCService instance on port ${port}`);
					resolve(this.proc)
				})
				this.proc.once("exit", () => {
					this.proc = null;
					logger.info(`Job has ended, closing RCCService on port ${port}`)
				})
			} catch (_) {
				logger.error(_);
				reject(_)
			}
		})
	}

	Stop(signal = "SIGTERM") {
		if (!this.proc) throw new Error("Process is not running")
		return this.proc.kill(signal)
	}
}

module.exports = RCCService
