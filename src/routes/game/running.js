const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.get("/:token", async (request, response) => {
	const game = global.games.get(request.params.token)
	return response.end(!!game)
})

module.exports = app
