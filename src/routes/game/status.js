const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.get("/:id", async (request, response) => {
	const game = global.games.get(request.params.id)
	if (!game) return response.status(404).json({ error: "Game is not running" })

	const status = await game.GetStatus()
	return response.json(status[0]?.GetStatusResult)
})

module.exports = app
