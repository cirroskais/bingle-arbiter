const { readFileSync } = require("fs")
const soap = require("soap")
const { randomUUID } = require("crypto")

const express = require("express")
const app = express.Router()

app.get("/", async (request, response) => {
	let jobId = randomUUID()
	const client = await soap.createClientAsync(__dirname + "/../../lib/RCCService.wsdl", {}, "http://127.0.0.1:64989/")
	const result = await client.OpenJobExAsync({
		job: {
			id: jobId,
			expirationInSeconds: 2,
			category: 100,
			cores: 1,
		},
		script: {
			name: jobId,
			script: readFileSync(__dirname + "/../../lua/user_headshot.lua", { encoding: "utf-8" }),
			arguments: {
				LuaValue: [
					{
						type: "LUA_TSTRING",
						value: jobId,
					},
					{
						type: "LUA_TSTRING",
						value: "Headshot",
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
						value: "-1",
					},
				],
			},
		},
	})

	response.json(result[0])
})

module.exports = app
