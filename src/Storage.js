//key user Id, value key aes
const AESKey = [];

//key : user Id, value : socket id
const UserId_SocketId = [];
const SocketId_UserId = [];
//value user Id
const UserId = new Set();
const UsersOn = new Set();

module.exports = {AESKey, SocketId_UserId, UserId_SocketId, UserId, UsersOn};
