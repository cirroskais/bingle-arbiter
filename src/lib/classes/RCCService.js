const EventEmitter = require("events")
const child_process = require("child_process")
const waitPort = require("wait-port")
const logger = require("../../lib/logger.js")

class RCCService extends EventEmitter {
	constructor(port, path = process.env.RCCSERVICE_PATH) {
		super()
		this.path = path
		this.port = port
	}

	Start(options = { cwd: this.path }) {
		return new Promise((resolve, reject) => {
			try {
				if (process.platform == "win32") {
					this.proc = child_process.spawn("RCCService.exe", ["-Console", "-PlaceId:-1", `-Port`, this.port], options)
				} else {
					this.proc = child_process.spawn("wine", ["RCCService.exe", "-Console", "-PlaceId:-1", `-Port`, this.port], options)
				}

				this.proc.once("spawn", async () => {
					logger.info(`[${this.port}] RCCService instance spawned`)
					const { open } = await waitPort({ host: "127.0.0.1", port: this.port, timeout: 5000, output: "silent" }).catch((e) => console.log(e))
					if (!open || this.proc.exitCode !== null) {
						logger.error(`[${this.port}] RCCService could not listen, exiting`)
						this.Close()
						return resolve(false)
					}

					return resolve(true)
				})

				this.proc.once("exit", () => {
					this.proc = null
					logger.info(`[${this.port}] RCCService instance exited`)
				})
			} catch (_) {
				resolve(false)
			}
		})
	}

	Stop(signal = "SIGTERM") {
		if (!this.proc) return
		return this.proc.kill(signal)
	}
}

module.exports = RCCService
