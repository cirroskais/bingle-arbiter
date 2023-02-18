const { readFile } = require("fs/promises")

const Job = require("./Job.js")
const logger = require("../logger.js")

class RenderJob extends Job {
	constructor() {
		super()
	}

	async RenderHeadshot(id) {
		const running = this.started
		if (!running) {
			const started = await this.Start()
			if (!started) throw new Error("RCCService failed to start")
		}

		if (!this.client) await this.CreateClient()

		logger.info(`[${this.id}] Headshot RenderJob started for ${id}`)

		const result = await this.OpenJobEx({
			name: this.id,
			script: await readFile(__dirname + "/../../lua/headshot.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{ type: "LUA_TSTRING", value: this.id },

					{ type: "LUA_TSTRING", value: "Headshot" },
					{ type: "LUA_TSTRING", value: process.env.RENDER_FORMAT },

					{ type: "LUA_TNUMBER", value: process.env.RENDER_USER_WIDTH },
					{ type: "LUA_TNUMBER", value: process.env.RENDER_USER_HEIGHT },

					{ type: "LUA_TSTRING", value: process.env.BASE_URL },
					{ type: "LUA_TNUMBER", value: id },
				],
			},
		}).catch((e) => false)

		logger.info(`[${this.id}] Headshot RenderJob finished for ${id}`)

		if (!result) return false
		return result[0]?.OpenJobExResult?.LuaValue[0]?.value
	}

	async RenderBodyshot(id, three_d = false) {
		const running = this.started
		if (!running) {
			const started = await this.Start()
			if (!started) throw new Error("RCCService failed to start")
		}

		if (!this.client) await this.CreateClient()

		if (three_d) logger.info(`[${this.id}] 3D Bodyshot RenderJob started for ${id}`)
		else logger.info(`[${this.id}] Bodyshot RenderJob started for ${id}`)

		const result = await this.OpenJobEx({
			name: this.id,
			script: await readFile(__dirname + "/../../lua/bodyshot.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{ type: "LUA_TSTRING", value: this.id },

					{ type: "LUA_TSTRING", value: "Bodyshot" },
					{ type: "LUA_TSTRING", value: three_d ? "OBJ" : process.env.RENDER_FORMAT },

					{ type: "LUA_TNUMBER", value: process.env.RENDER_USER_WIDTH },
					{ type: "LUA_TNUMBER", value: process.env.RENDER_USER_HEIGHT },

					{ type: "LUA_TSTRING", value: process.env.BASE_URL },
					{ type: "LUA_TNUMBER", value: id },
				],
			},
		}).catch((e) => false)

		if (three_d) logger.info(`[${this.id}] 3D Bodyshot RenderJob finished for ${id}`)
		else logger.info(`[${this.id}] Bodyshot RenderJob finished for ${id}`)

		if (!result) return false
		return result[0]?.OpenJobExResult?.LuaValue[0]?.value
	}

	async RenderAsset(id, three_d = false) {
		const running = this.started
		if (!running) {
			const started = await this.Start()
			if (!started) throw new Error("RCCService failed to start")
		}

		if (!this.client) await this.CreateClient()

		if (three_d) logger.info(`[${this.id}] 3D Asset RenderJob started for ${id}`)
		else logger.info(`[${this.id}] Asset RenderJob started for ${id}`)

		const result = await this.OpenJobEx({
			name: this.id,
			script: await readFile(__dirname + "/../../lua/xml.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{ type: "LUA_TSTRING", value: this.id },

					{ type: "LUA_TSTRING", value: "Asset" },
					{ type: "LUA_TSTRING", value: three_d ? "OBJ" : process.env.RENDER_FORMAT },

					{ type: "LUA_TNUMBER", value: process.env.RENDER_ASSET_WIDTH },
					{ type: "LUA_TNUMBER", value: process.env.RENDER_ASSET_HEIGHT },

					{ type: "LUA_TSTRING", value: process.env.BASE_URL },
					{ type: "LUA_TNUMBER", value: id },
					{ type: "LUA_TBOOLEAN", value: "true" },
				],
			},
		}).catch((e) => false)

		if (three_d) logger.info(`[${this.id}] 3D Asset RenderJob finished for ${id}`)
		else logger.info(`[${this.id}] Asset RenderJob finished for ${id}`)

		if (!result) return false
		return result[0]?.OpenJobExResult?.LuaValue[0]?.value
	}

	async RenderPlace(id) {
		const response = await axios(`${process.env.BASE_URL}/API/Game/${id}?t=${process.env.ARBITER_TOKEN}`).catch((_) => reject(_))
		const { server_token, server_port, server_owner_id } = response.data

		this.id = server_token

		const running = this.started
		if (!running) {
			const started = await this.Start()
			if (!started) throw new Error("RCCService failed to start")
		}

		if (!this.client) await this.CreateClient()

		logger.info(`[${this.id}] Place RenderJob started for ${id}`)

		const result = await this.OpenJobEx({
			name: this.id,
			script: await readFile(__dirname + "/../../lua/place.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{ type: "LUA_TSTRING", value: this.id },

					{ type: "LUA_TSTRING", value: "Place" },
					{ type: "LUA_TSTRING", value: process.env.RENDER_FORMAT },

					{ type: "LUA_TNUMBER", value: process.env.RENDER_PLACE_WIDTH },
					{ type: "LUA_TNUMBER", value: process.env.RENDER_PLACE_HEIGHT },

					{ type: "LUA_TSTRING", value: process.env.BASE_URL },
					{ type: "LUA_TNUMBER", value: id },
				],
			},
		}).catch((e) => false)

		logger.info(`[${this.id}] Place RenderJob finished for ${id}`)

		if (!result) return false
		return result[0]?.OpenJobExResult?.LuaValue[0]?.value
	}
}

module.exports = RenderJob
