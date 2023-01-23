const axios = require("axios")
const { readFileSync } = require("fs")

const Job = require("./Job.js")
const logger = require("../logger.js")

class GameJob extends Job {
	constructor() {
		super({ expirationInSeconds: 360 })
	}

	StartGame(id) {
		return new Promise(async (resolve, reject) => {
			const response = await axios(`${process.env.BASE_URL}/API/Game/${id}?t=${process.env.ARBITER_TOKEN}`).catch((_) => reject(_))
			const { server_token, server_port, server_owner_id } = response.data

			this.id = server_token
			this.placeId = id

			const started = await this.Start()
			if (!started) throw new Error("RCCService failed to start")
			if (!this.client) await this.CreateClient()

			logger.info(`[${this.id}] GameJob started for ${id}`)

			this.OpenJobEx({
				name: this.id,
				script: readFileSync(__dirname + "/../../lua/gameserver.lua", { encoding: "utf-8" }),
				arguments: {
					LuaValue: [
						{ type: "LUA_TSTRING", value: this.id },
						{ type: "LUA_TSTRING", value: "Place" },

						{ type: "LUA_TSTRING", value: process.env.BASE_URL },

						{ type: "LUA_TNUMBER", value: id },
						{ type: "LUA_TNUMBER", value: server_port },
						{ type: "LUA_TNUMBER", value: server_owner_id },
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
