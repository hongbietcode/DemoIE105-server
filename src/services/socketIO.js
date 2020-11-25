const SocketId_UserId = require("../Storage").SocketId_UserId;
const UserId_SocketId = require("../Storage").UserId_SocketId;
const UserId = require("../Storage").UserId;
const AESKey = require("../Storage").AESKey;

const AES = require("../Cryptos/AESCrypto");

class SocketIO {
	constructor(httpServer) {
		this._start(httpServer);
	}

	_start(httpServer) {
		console.log("🌊 🌊 🌊  Socket IO starting !!!");
		//allow access origin socket
		const io = require("socket.io")(httpServer, {
			cors: {
				origin: "http://localhost:3000",
				methods: ["GET", "POST"],
			},
		});

		io.on("connection", (socket) => {
			console.log("✅  New client connection !");

			socket.on("USER_ID", (data) => {
				console.log(`✅  UserID: ${data} 🔛  SocketID: ${socket.id}`);
				UserId.add(data);
				// NOTE:
				if (
					SocketId_UserId[socket.id] === undefined &&
					UserId_SocketId[data] === undefined
				) {
					UserId_SocketId[data] = socket.id;
					SocketId_UserId[socket.id] = data;
				}
			});

			socket.on("CLIENT", (data) => {
				console.log("🎉  message: ", data);

				// NOTE: su dung truyen du lieu aes hoac khong
				if (data.aes === false) {
					socket.broadcast.emit("SERVER", data);
				} else {
					data = {
						...data,
						payload: AES.decryptMessage(data.payload, data.userId),
					};

					console.log("💱  encrypt:", data);
					UserId.forEach((id) => {
						const newData = {
							...data,
							payload: AES.encryptMessage(data.payload, id),
						};

						if (data.userId !== id) io.to(UserId_SocketId[id]).emit("SERVER", newData);
					});
				}
			});

			socket.on("WILL_DISCONNECT", (data) => {
				UserId.delete(data);
				console.log(`❌  User: ${data} logout !!!`);
			});

			socket.on("disconnect", () => {
				const userId = SocketId_UserId[socket.id];
				UserId_SocketId[userId] = undefined;
				SocketId_UserId[socket.id] = undefined;
				console.log("👉 ", `UserId: ${userId} disconnect !!!`);
			});
		});
	}
}

module.exports = SocketIO;
