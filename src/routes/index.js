const express = require("express")
const app = express.Router()

function getGameIds() {
	let gameIds = []

	global.games.forEach((value, key) => {
		gameIds.push(value.placeId)
	})

	return gameIds
}

app.get("/", (request, response) => {
	return response.status(200).json({
		runningGamesCount: global.games.size,
		runningGames: getGameIds(),
	})
})

app.all("*", (request, response) => response.status(404).json({ status: 404 }))

module.exports = app
