const SocketId_UserId = require("../Storage").SocketId_UserId;
const UserId_SocketId = require("../Storage").UserId_SocketId;
const UserId = require("../Storage").UserId;
const AESKey = require("../Storage").AESKey;
const AES = require("../Cryptos/AESCrypto");

const Message = require("../models/message");

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
				console.log(`🔊   UserID: ${data.userId} 🔛  SocketID: ${socket.id}`);
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

				// console.log("AESKey :", AESKey);
				// console.log("UserID :", UserId);
				// console.log("UserId_SocketId :", UserId_SocketId);
				// console.log("SocketId_UserId :", SocketId_UserId);
			});

			socket.on("CLIENT", (data) => {
				console.log("-------------------MESSAGE-----------------");
				console.log("🎉  Message: ", data);

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

					console.log("💱  Decrypt:", data);
					console.log("🔑  [UserId, AESKey] :", AESKey);

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

				//storage messages database
				new Message({
					user: data.user,
					userId: data.userId,
					payload: data.payload,
				}).save();
			});

			socket.on("LOGOUT", (data) => {
				UserId.delete(data);
				console.log("-------------USER-LOGOUT------------------");
				if (AESKey[data]) AESKey[data] = undefined;
				console.log(`🔊   User: ${data} logout !!!`);
			});

			socket.on("disconnect", () => {
				const userId = SocketId_UserId[socket.id];
				socket.broadcast.emit("UN_ACTIVE_USER", {
					userId: userId,
					state: "disconnect",
				});

				UserId_SocketId[userId] = undefined;
				SocketId_UserId[socket.id] = undefined;

				console.log("🔊  ", `UserId: ${userId} ❌  SocketID: ${socket.id} !!!`);

				// console.log("UserID :", UserId);
				// console.log("UserId_SocketId :", UserId_SocketId);
				// console.log("SocketId_UserId :", SocketId_UserId);
			});
		});
	}
}

module.exports = SocketIO;
