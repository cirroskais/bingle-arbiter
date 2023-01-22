require("dotenv").config()
const express = require("express")
const app = express()

const logger = require("./lib/logger.js")

if (process.platform == "linux") logger.warn("Game hosting might not fully compatible with Linux")

app.use("/place/start", require("./routes/place/start.js"))
app.use("/place/stop", require("./routes/place/stop.js"))
app.use("/place/execute", require("./routes/place/execute.js"))
app.use("/place/renew", require("./routes/place/renew.js"))

app.use("/render/asset", require("./routes/render/asset.js"))
app.use("/render/place", require("./routes/render/place.js"))
app.use("/render/headshot", require("./routes/render/headshot.js"))
app.use("/render/bodyshot", require("./routes/render/bodyshot.js"))

app.use("*", require("./routes/index.js"))

app.listen(process.env.PORT || 64989, () => {
	logger.boot(`Listening on http://127.0.0.1:${process.env.PORT || 64989}/`)
})

process.on("uncaughtException", (err) => {
	logger.error(err.message)
})
