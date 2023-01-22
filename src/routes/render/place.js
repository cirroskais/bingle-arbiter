const express = require("express")
const app = express.Router()

app.all("*", (request, response) => response.status(404).json({ status: 404 }))

module.exports = app
