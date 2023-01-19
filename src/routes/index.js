const express = require("express")
const app = express.Router()

app.all("*", (request, response) => response.status(200).end("Hi"))

module.exports = app
