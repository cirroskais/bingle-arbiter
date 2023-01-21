const { readFileSync } = require("fs")
const { randomUUID } = require("crypto")
const logger = require("../../lib/logger.js")
const randport = require("../../lib/randport.js")
const Job = require("../../lib/classes/Job.js")

const express = require("express")
const app = express.Router()

app.get("/:id", async (request, response) => {
	const job = new Job(randomUUID(), await randport())
	const started = await job.Start()
	if (!started) return response.status(500).json({ error: "RCCService failed to start" })

	logger.info(`[${job.id}] Job opened`)
	await job.CreateClient()
	const result = await job
		.Open({
			name: job.id,
			script: readFileSync(__dirname + "/../../lua/headshot.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{ type: "LUA_TSTRING", value: job.id },
					{ type: "LUA_TSTRING", value: "Headshot" },
					{ type: "LUA_TSTRING", value: "PNG" },

					// change this to 1920x when we finish the arbiter
					{ type: "LUA_TNUMBER", value: "420" },
					{ type: "LUA_TNUMBER", value: "420" },

					{ type: "LUA_TSTRING", value: "https://economy.ittblox.gay" },
					{ type: "LUA_TNUMBER", value: request.params.id },
				],
			},
		})
		.catch((e) => false)

	logger.info(`[${job.id}] Job closed`)
	await job.Stop()

	if (result) return response.end(Buffer.from(result[0]?.OpenJobExResult?.LuaValue[0]?.value, "base64"))
	else return response.status(500).end()
})

module.exports = app
