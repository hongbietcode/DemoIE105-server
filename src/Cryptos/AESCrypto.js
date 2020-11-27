const CryptoJS = require("crypto-js");
const DiffieHellman = require("./DiffieHellman");
const KeyStore = require("../Storage").AESKey;

//generate key AES
const generateSecretKey = (clientKey, userId) => {
	const secretKey = DiffieHellman.Server.generateSecretKey(clientKey);
	if (userId) KeyStore[userId] = secretKey;
	return secretKey;
};

const encrypt = (jsonData, userId) => {
	const key = KeyStore[userId];
	if (key) return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
	return "😀";
};

const decrypt = (encrypt, userId) => {
	const key = KeyStore[userId];
	if (key) return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
	return encrypt;
};

const encryptMessage = (message, userId) => {
	const key = KeyStore[userId];
	if (key) return CryptoJS.AES.encrypt(message, key).toString();
	return "😀";
};

const decryptMessage = (encrypt, userId) => {
	const key = KeyStore[userId];
	if (key) return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key));
	return encrypt;
};

module.exports = {generateSecretKey, encrypt, decrypt, encryptMessage, decryptMessage};
