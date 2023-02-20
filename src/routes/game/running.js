const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.get("/:id", async (request, response) => {
	const game = global.games.get(request.params.id)
	if (!game) return response.json(false)

	const running = await game.Running()
	if (!running && game) {
		game.Stop()
		return response.json(false)
	}

	return response.json(true)
})

module.exports = app
