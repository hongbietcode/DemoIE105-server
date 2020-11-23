const CryptoJS = require("crypto-js");
const KeyStore = require("../AESKeyStorage");

//generate key AES
const generateSecretKey = (secretKey, clientKey, userId) => {
	const AESKey128bits = CryptoJS.PBKDF2(secretKey, clientKey, {
		keySize: 128 / 32,
	}).toString();
	KeyStore[userId] = AESKey128bits;
	return AESKey128bits;
};

const encrypt = (jsonData, userId) => {
	const key = KeyStore[userId];
	return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
};

const decrypt = (encrypt, userId) => {
	const key = KeyStore[userId];
	return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
};

module.exports = {generateSecretKey, encrypt, decrypt};
