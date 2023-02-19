require("dotenv").config()
const express = require("express")
const app = express()

const logger = require("./lib/logger.js")

if (process.platform == "linux") logger.warn("Game hosting might not be fully compatible with Linux")

global.games = new Map()

setInterval(() => {
	global.games.forEach(async (value, key) => {
		if (!(await value.Running())) value.Stop()
	})
}, 15000)

const validateQueryParam = (req, res, next) => {
  const myQueryParam = process.env.accessKey; 
  if (req.query.hasOwnProperty(myQueryParam)) { 
    next();
  } else {
    res.status(400).send(`This is just a normal site, nothing is located here...`);
  }
}

app.use(validateQueryParam);

app.use("/game/start", require("./routes/game/start.js"))
app.use("/game/stop", require("./routes/game/stop.js"))
app.use("/game/running", require("./routes/game/running.js"))
app.use("/game/renew", require("./routes/game/renew.js"))
app.use("/game/status", require("./routes/game/status.js"))
app.use("/game/execute", require("./routes/game/execute.js"))

app.use("/render/asset", require("./routes/render/asset.js"))
//app.use("/render/game", require("./routes/render/game.js"))
//app.use("/render/texture", require("./routes/render/texture.js"))
app.use("/render/user", require("./routes/render/user.js"))
app.use("/render/texture", require("./routes/render/texture.js"))

app.use("*", require("./routes/index.js"))

app.listen(process.env.PORT || 64989, () => {
	logger.boot(`Listening on http://127.0.0.1:${process.env.PORT || 64989}/`)
})

process.on("uncaughtException", (err) => {
	logger.error(err.message)
})
