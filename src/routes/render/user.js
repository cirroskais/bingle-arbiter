const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id/bodyshot", async (request, response) => {
	const { params } = request
	const job = new RenderJob()

	const bodyshot = await job.RenderBodyshot(params.id).catch((_) => _)
	if (bodyshot?.message) return response.status(500).json({ error: bodyshot.message })

	return response.end(bodyshot)
})

app.get("/:id/headshot", async (request, response) => {
	const { params } = request
	const job = new RenderJob()

	const headshot = await job.RenderHeadshot(params.id).catch((_) => _)
	if (headshot?.message) return response.status(500).json({ error: headshot.message })

	return response.end(headshot)
})

app.get("/:id/3d", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()

	const three_d = await job.RenderBodyshot(params.id, true).catch((_) => _)
	if (three_d?.message) return response.status(500).json({ error: three_d.message })

	return response.json(JSON.parse(three_d))
})

module.exports = app
