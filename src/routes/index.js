const waitPort = require("wait-port")
const { readFileSync, read } = require("fs")
const express = require("express")
const Job = require("../lib/classes/Job.js")
const app = express.Router()

let tempPort = 64990

app.all("*", async (request, response) => {
	const job = new Job("KILL JACKD", tempPort)
	await job.Start()

	const { open } = await waitPort({ host: "127.0.0.1", port: tempPort, timeout: 5000, output: "silent" })
	if (!open) {
		job.Close()
		return response.json(false)
	}

	await job.CreateClient()
	const result = await job.Open({
		name: job.id,
		script: readFileSync(__dirname + "/../lua/user_headshot.lua", { encoding: "utf-8" }),
		arguments: {
			LuaValue: [
				{ type: "LUA_TSTRING", value: job.id },
				{ type: "LUA_TSTRING", value: "RenderUserHeadshot" },
				{ type: "LUA_TSTRING", value: "PNG" },
				{ type: "LUA_TNUMBER", value: "1920" },
				{ type: "LUA_TNUMBER", value: "1920" },
				{ type: "LUA_TSTRING", value: "https://sitetest.unexp.xyz" },
				{ type: "LUA_TNUMBER", value: "1" },
			],
		},
	})
	await job.Stop()

	return response.end(Buffer.from(result[0].OpenJobExResult.LuaValue[0].value, "base64"))
})

module.exports = app
