const waitPort = require("wait-port")
const { readFileSync } = require("fs")
const { randomUUID } = require("crypto")
const logger = require("../../lib/logger.js")
const Job = require("../../lib/classes/Job.js")

const express = require("express")
const app = express.Router()

app.get("/", async (request, response) => {
	let tempPort = 64990
	const job = new Job(randomUUID(), tempPort)
	await job.Start()

	const { open } = await waitPort({ host: "127.0.0.1", port: tempPort, timeout: 5000, output: "silent" })
	if (!open) {
		logger.warn("Job could not be started because port is already taken. Closing job..")
		job.Close()
		return response.json(false)
	}

	await job.CreateClient()
	const result = await job.Open({
		name: job.id,
		script: readFileSync(__dirname + "/../lua/headshot.lua", { encoding: "utf-8" }),
		arguments: {
			LuaValue: [
				{ type: "LUA_TSTRING", value: job.id },
				{ type: "LUA_TSTRING", value: "Headshot" },
				{ type: "LUA_TSTRING", value: "PNG" },

				// change this to 1920x when we finish the arbiter
				{ type: "LUA_TNUMBER", value: "420" },
				{ type: "LUA_TNUMBER", value: "420" },

				{ type: "LUA_TSTRING", value: "https://economy.ittblox.gay" },
				{ type: "LUA_TNUMBER", value: "1" },
			],
		},
	})

	await job.Stop()
	return response.end(Buffer.from(result[0].OpenJobExResult.LuaValue[0].value, "base64"))
})

module.exports = app
