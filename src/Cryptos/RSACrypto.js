const NodeRSA = require("node-rsa");

class RSA {
	constructor() {
		const key = new NodeRSA({b: 1024});
		this.privateKey = key.exportKey("private");
		this.publicKey = key.exportKey("public");
	}
}

const Decrypting = (buffer, privateKey, type) => {
	const key = new NodeRSA();
	key.importKey(privateKey);

	const result = key.decrypt(buffer, type);
	return result;
};

module.exports = {Key: new RSA(), Decrypting};
