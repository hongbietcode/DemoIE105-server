class SocketIO {
	constructor(httpServer) {
		this._start(httpServer);
	}

	_start(httpServer) {
		console.log("Starting");
		//allow access origin socket
		const io = require("socket.io")(httpServer, {
			cors: {
				origin: "http://localhost:3000",
				methods: ["GET", "POST"],
			},
		});

		let interval;
		io.on("connection", (socket) => {
			console.log("new client connection");
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval(() => getApiAndEmit(socket), 1000);
			socket.on("disconnect", () => {
				clearInterval(interval);
			});
		});

		const getApiAndEmit = (socket) => {
			const response = new Date();
			// Emitting a new message. Will be consumed by the client
			socket.emit("FromAPI", response);
		};
	}
}

module.exports = SocketIO;
