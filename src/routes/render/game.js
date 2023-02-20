const express = require("express")
const app = express.Router()

const RenderJob = require("../../lib/classes/RenderJob.js")

// app.get("/:id", async (request, response) => {
// 	const job = new RenderJob()
// 	const result = await job.RenderPlace(request.params.id, process.env.RENDER_BASE64).catch((_) => _)

// 	if (result?.message) return response.status(500).json({ error: result.message })
// 	else return response.end(result)
// })

app.get("*", (request, response) => {
	response.status(501).end("Not Implemented")
})

module.exports = app
