const axios = require("axios")
const { readFile } = require("fs/promises")

const Job = require("./Job.js")
const logger = require("../logger.js")

class GameJob extends Job {
	constructor() {
		super({ expirationInSeconds: 360 })
	}

	StartGame(id, port) {
		return new Promise(async (resolve, reject) => {
			this.placeId = id
			this.port = port

			if (!started) throw new Error("RCCService failed to start")
			if (!this.client) await this.CreateClient()

			logger.info(`[${this.id}] GameJob started for ${id}`)

			this.OpenJobEx({
				name: this.id,
				script: await readFile(__dirname + "/../../lua/gameserver.lua", { encoding: "utf-8" }),
				arguments: {
					LuaValue: [
						{ type: "LUA_TSTRING", value: this.id },
						{ type: "LUA_TSTRING", value: "Place" },

						{ type: "LUA_TSTRING", value: process.env.BASE_URL },

						{ type: "LUA_TNUMBER", value: id },
						{ type: "LUA_TNUMBER", value: port },
					],
				},
			}).catch((e) => reject(e))

			resolve()
		})
	}

	async Running() {
		const result = await this.Execute("IsRunning", "return true").catch((_) => _)
		return !result?.message
	}
}

module.exports = GameJob
