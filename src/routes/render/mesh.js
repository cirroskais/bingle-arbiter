const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

app.get("/:id", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()

	const asset = await job.RenderMesh(params.id).catch((_) => _)
	if (asset?.message) return response.status(500).json({ error: asset.message })

	return response.end(asset)
})

app.get("/:id/3d", async (request, response) => {
	const { params, query } = request
	const job = new RenderJob()

	const three_d = await job.RenderMesh(params.id, true).catch((_) => _)
	if (three_d?.message) return response.status(500).json({ error: three_d.message })

	return response.json(JSON.parse(three_d))
})

module.exports = app
