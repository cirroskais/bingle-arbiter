const express = require("express");
const app = express.Router();

const RenderJob = require("../../lib/classes/RenderJob.js");

app.get("/:id", async (request, response) => {
	const { params, query } = request;
	const job = new RenderJob();
	let body = {};

	const aseet = await job.RenderAsset(params.id).catch((_) => _);
	if (aseet?.message) {
		job.Stop();
		return response.status(500).json({ error: aseet.message });
	}
	body.aseet = aseet;

	if (query.three_d) {
		const three_d = await job.RenderAsset(params.id, true).catch((_) => _);
		if (three_d?.message) {
			job.Stop();
			return response.status(500).json({ error: three_d.message });
		}
		body.three_d = three_d;
	}

	job.Stop();

	return response.json(body);
});

module.exports = app;
