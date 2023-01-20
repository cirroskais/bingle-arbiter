const soap = require("soap")
const { readFileSync } = require("fs")
const express = require("express")
const RCCService = require("../lib/classes/RCCService")
const wait = require("../lib/wait")
const app = express.Router()

app.all("*", async (request, response) => {
	const rcc = new RCCService()
	const proc = await rcc.start(64989)
	if (proc.exitCode !== null) return response.json(false)

	await wait(5000)

	const jobId = "RenderTest"
	const client = await soap.createClientAsync(__dirname + "/../lib/RCCService.wsdl", {}, "http://127.0.0.1:64989/")
	const result = await client.OpenJobExAsync({
		job: {
			id: jobId,
			expirationInSeconds: 10,
			category: 0,
			cores: 1,
		},
		script: {
			name: jobId,
			script: readFileSync(__dirname + "/../lua/user.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{
						type: "LUA_TSTRING",
						value: jobId,
					},
					{
						type: "LUA_TSTRING",
						value: "Avatar",
					},
					{
						type: "LUA_TSTRING",
						value: "PNG",
					},
					{
						type: "LUA_TNUMBER",
						value: "1920",
					},
					{
						type: "LUA_TNUMBER",
						value: "1920",
					},
					{
						type: "LUA_TSTRING",
						value: "https://sitetest.unexp.xyz",
					},
					{
						type: "LUA_TNUMBER",
						value: "1",
					},
				],
			},
		},
	})

	rcc.stop()
	return response.end(Buffer.from(result[0].OpenJobExResult.LuaValue[0].value, "base64"))
})

module.exports = app
