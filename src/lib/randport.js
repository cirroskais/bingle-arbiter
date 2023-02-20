const net = require("net")
const dgram = require("dgram")

exports.tcp = () => {
	return new Promise((resolve) => {
		const server = net.createServer()
		server.listen(0, () => {
			const port = server.address().port
			server.close((err) => resolve(port))
		})
	})
}

exports.udp = () => {
	return new Promise((resolve) => {
		const server = dgram.createSocket("udp4")
		server.bind(Math.random() * (60_000 - 50_000) + 50_000, () => {
			const port = server.address().port
			server.close((err) => resolve(port))
		})
	})
}
