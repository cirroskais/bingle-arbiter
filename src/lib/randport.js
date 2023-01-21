const net = require("net")

module.exports = () => {
	return new Promise((resolve) => {
		const server = net.createServer()
		server.listen(0, () => {
			const port = server.address().port
			server.close((err) => resolve(port))
		})
	})
}
