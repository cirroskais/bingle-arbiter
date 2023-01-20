const EventEmitter = require("events")
const child_process = require("child_process")

class RCCService extends EventEmitter {
	constructor(path = process.env.RCCSERVICE_PATH) {
		super()
		this.path = path
	}

	start(port, options = { cwd: this.path }) {
		return new Promise((resolve, reject) => {
			try {
				this.proc = child_process.spawn("wine", ["RCCService.exe", "-console", "-placeid:-1", `-port`, port], options)
				this.proc.once("spawn", resolve(this.proc))
				this.proc.once("exit", () => {
					this.proc = null
				})
			} catch (_) {
				reject(_)
			}
		})
	}

	stop(signal = "SIGTERM") {
		if (!this.proc) throw new Error("Process is not running")
		return this.proc.kill(signal)
	}
}

module.exports = RCCService
