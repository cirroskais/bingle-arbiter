const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()

	const texture = await job.RenderTexture(params.id).catch((_) => _)
	if (texture?.message) return response.status(500).json({ error: texture.message })

	return response.end(texture)
})

module.exports = app
