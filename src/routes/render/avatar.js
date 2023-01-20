const express = require("express")
const app = express.Router()

app.all("*", (request, response) => response.status(404).end())

module.exports = app
