const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.get("/:id/:expire", async (request, response) => {
	const game = global.games.get(request.params.id)
	if (!game) return response.status(404).json({ error: "Game is not running" })

	await game.RenewLease(request.params.expire)
	return response.json({ success: true })
})

module.exports = app
