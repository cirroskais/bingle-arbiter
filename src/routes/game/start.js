const express = require("express")
const app = express.Router()

const GameJob = require("../../lib/classes/GameJob.js")

app.get("/:id", async (request, response) => {
	const game = global.games.get(request.params.id)
	if (game) return response.status(400).json({ error: "Game is running" })

	const job = new GameJob()
	const result = await job.StartGame(request.params.id, request.query.port).catch((_) => _)

	global.games.set(job.id, job)
	job.proc.once("exit", () => {
		global.games.delete(job.id)
	})

	return response.json({ success: true })
})

module.exports = app
