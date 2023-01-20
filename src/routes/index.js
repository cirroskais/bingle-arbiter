const express = require("express")
const app = express.Router()

app.get("/", (request, response) => response.status(200).json())

app.all("*", (request, response) => response.status(404).json({ status: 404 }))

module.exports = app
