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
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		io.on("connection", (socket) => {
			console.log("✅  New client connection !");

			socket.on("USER_ID", (data) => {
				console.log(`✅  UserID: ${data.userId} 🔛  SocketID: ${socket.id}`);
				UserId.add(data.userId);
				// NOTE:
				if (
					SocketId_UserId[socket.id] === undefined &&
					UserId_SocketId[data.userId] === undefined
				) {
					UserId_SocketId[data.userId] = socket.id;
					SocketId_UserId[socket.id] = data.userId;
				}
				socket.broadcast.emit("ACTIVE_USER", {
					userId: data.userId,
					state: "active",
				});
			});

			socket.on("CLIENT", (data) => {
				console.log("-------------------MESSAGE-----------------");
				console.log("🎉  message: ", data);

				io.sockets.emit("ACTIVE_USER", {
					userId: data.userId,
					state: "active",
				});

				// truyen tin nhan khong su dung aes
				if (data.aes === false) {
					socket.broadcast.emit("SERVER", data);
				}
				//truyen tin nhan su dung aess
				else {
					//decrypt message data
					data = {
						...data,
						payload: AES.decryptMessage(data.payload, data.userId),
					};

					console.log("💱  decrypt:", data);
					console.log("🔑  AESKey :", AESKey);

					//loop va ma hoa du lieu cho tung user
					UserId.forEach((id) => {
						const newData = {
							...data,
							payload: AES.encryptMessage(data.payload, id),
						};

						if (data.userId !== id) io.to(UserId_SocketId[id]).emit("SERVER", newData);
					});
				}
				console.log("------------------END-MESSAGE--------------");
			});
			socket.on("WILL_DISCONNECT", (data) => {
				UserId.delete(data);

				socket.broadcast.emit("UN_ACTIVE_USER", {
					userId: data,
					state: "disconnect",
				});
				console.log(`❌  User: ${data} logout !!!`);
			});

			socket.on("disconnect", () => {
				const userId = SocketId_UserId[socket.id];

				if (AESKey[userId]) AESKey[userId] = undefined;
				UserId_SocketId[userId] = undefined;
				SocketId_UserId[socket.id] = undefined;

				console.log("❌ ", `UserId: ${userId} disconnect !!!`);
			});
		});
	}
}

module.exports = SocketIO;
