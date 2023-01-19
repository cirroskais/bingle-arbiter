const logger = require("./lib/logger.js")
const express = require("express")
const app = express()

app.use("/game/start", require("./routes/game/start.js"))
app.use("/game/stop", require("./routes/game/stop.js"))
app.use("/game/execute", require("./routes/game/execute.js"))

app.use("/render/asset", require("./routes/render/asset.js"))
app.use("/render/avatar", require("./routes/render/avatar.js"))
app.use("/render/game", require("./routes/render/game.js"))

app.use("*", require("./routes/index.js"))

app.listen(process.env.PORT || 5173, () => {
	logger.info(`Listening on http://127.0.0.1:${process.env.PORT || 5173}/`)
})
