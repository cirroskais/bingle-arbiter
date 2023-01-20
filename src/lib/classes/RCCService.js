const EventEmitter = require("events")
const child_process = require("child_process")

class RCCService extends EventEmitter {
	constructor(port, path = process.env.RCCSERVICE_PATH) {
		super()
		this.path = path
		this.port = port
	}

	Start(options = { cwd: this.path }) {
		return new Promise((resolve, reject) => {
			try {
				this.proc = child_process.spawn("wine", ["RCCService.exe", "-Console", "-PlaceId:-1", `-Port`, this.port], options)
				this.proc.once("spawn", () => resolve(this))
				this.proc.once("exit", () => {
					this.proc = null
				})
			} catch (_) {
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
