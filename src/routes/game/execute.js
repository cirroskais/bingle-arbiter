const { randomUUID } = require("crypto")
const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.use(express.json())

app.post("/:id", async (request, response) => {
	const game = global.games.get(request.params.id)
	if (!game) return response.status(404).json({ error: "Game is not running" })

	const { script } = request.body
	const jobResponse = await game.Execute(randomUUID(), script).catch((_) => _)

	return response.json({ response: jobResponse })
})

module.exports = app
