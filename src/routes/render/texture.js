const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()
	let body = {}

	const texture = await job.RenderTexture(params.id).catch((_) => _)
	if (texture?.message) {
		job.Stop()
		return response.status(500).json({ error: texture.message })
	}
	body.texture = texture

	job.Stop()

	return response.json(body)
})

module.exports = app
