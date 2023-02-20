const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()

	const game = await job.RenderPlace(params.id).catch((_) => _)
	if (game?.message) return response.status(500).json({ error: game.message })

	return response.end(game)
})

module.exports = app
