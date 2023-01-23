require("dotenv").config()
const express = require("express")
const app = express()

const logger = require("./lib/logger.js")

if (process.platform == "linux") logger.warn("Game hosting might not be fully compatible with Linux")
global.games = new Map()

app.use("/game/start", require("./routes/game/start.js"))
app.use("/game/stop", require("./routes/game/stop.js"))
app.use("/game/execute", require("./routes/game/execute.js"))
app.use("/game/renew", require("./routes/game/renew.js"))

app.use("/render/asset", require("./routes/render/asset.js"))
app.use("/render/game", require("./routes/render/game.js"))
app.use("/render/headshot", require("./routes/render/headshot.js"))
app.use("/render/bodyshot", require("./routes/render/bodyshot.js"))

app.use("*", require("./routes/index.js"))

app.listen(process.env.PORT || 64989, () => {
	logger.boot(`Listening on http://127.0.0.1:${process.env.PORT || 64989}/`)
})

process.on("uncaughtException", (err) => {
	logger.error(err.message)
})
