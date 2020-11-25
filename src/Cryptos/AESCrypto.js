const CryptoJS = require("crypto-js");
const KeyStore = require("../Storage").AESKey;
const KeyChart = require("../Storage").KeyChart;

//generate key AES
const generateSecretKey = (secretKey, clientKey, userId) => {
	const AESKey128bits = CryptoJS.PBKDF2(secretKey, clientKey, {
		keySize: 128 / 32,
	}).toString();
	if (userId) KeyStore[userId] = AESKey128bits;
	return AESKey128bits;
};

const encrypt = (jsonData, userId) => {
	const key = userId ? KeyStore[userId] : KeyChart;
	console.log(key);
	return CryptoJS.AES.encrypt(JSON.stringify(jsonData), key).toString();
};

const decrypt = (encrypt, userId) => {
	const key = userId ? KeyStore[userId] : KeyChart;
	return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encrypt, key)));
};

module.exports = {generateSecretKey, encrypt, decrypt};
