const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()
	let body = {}

	const headshot = await job.RenderHeadshot(params.id).catch((_) => _)
	if (headshot?.message) {
		job.Stop()
		return response.status(500).json({ error: headshot.message })
	}
	body.headshot = headshot

	const bodyshot = await job.RenderBodyshot(params.id).catch((_) => _)
	if (bodyshot?.message) {
		job.Stop()
		return response.status(500).json({ error: bodyshot.message })
	}
	body.bodyshot = bodyshot

	if (query.three_d) {
		const three_d = await job.RenderBodyshot(params.id, true).catch((_) => _)
		if (three_d?.message) {
			job.Stop()
			return response.status(500).json({ error: three_d.message })
		}
		body.three_d = three_d
	}

	job.Stop()

	return response.json(body)
})

module.exports = app
