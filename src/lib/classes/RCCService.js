const EventEmitter = require("events")
const child_process = require("child_process")
const waitPort = require("wait-port")

const logger = require("../../lib/logger.js")
const randport = require("../../lib/randport.js")

const chalk = require('chalk')

class RCCService extends EventEmitter {
	constructor() {
		super()
	}

	Start() {
		return new Promise(async (resolve, reject) => {
			try {
				this.port = await randport.tcp()

				if (process.platform == "win32") {
					this.proc = child_process.spawn("RCCService.exe", ["-Console", "-PlaceId:-1", `-Port`, this.port], { cwd: process.env.RCCSERVICE })
				} else {
					this.proc = child_process.spawn("wine", ["RCCService.exe", "-Console", "-PlaceId:-1", `-Port`, this.port], { cwd: process.env.RCCSERVICE })
				}

				this.proc.once("spawn", async () => {
					logger.info(`${chalk.gray(`[${this.port}]`)} RCCService instance spawned`)
					const { open } = await waitPort({ host: "127.0.0.1", port: this.port, timeout: 5000, output: "silent" }).catch((e) => console.log(e))
					if (!open || this.proc.exitCode !== null) {
						this.proc.kill()
						logger.error(`${chalk.gray(`[${this.port}]`)} RCCService could not listen`)
						return resolve(false)
					}

					return resolve(true)
				})

				this.proc.once("exit", () => {
					this.proc.kill()
					logger.info(`${chalk.gray(`[${this.port}]`)} RCCService instance exited`)
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