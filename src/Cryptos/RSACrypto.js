const NodeRSA = require("node-rsa");

class RSA {
	constructor() {
		const key = new NodeRSA({b: 1024});
		console.clear();
		console.log("----------------------Generate-RSA-Key-------------------------");
		console.log("--------------------------RSA-KEY------------------------------");
		this.privateKey = key.exportKey("private");
		this.publicKey = key.exportKey("public");
		console.log(this.privateKey);
		console.log();
		console.log(this.publicKey);
		console.log("----------------------END-RSA-KEY------------------------------");
	}
}

const Decrypting = (buffer, privateKey, type) => {
	const key = new NodeRSA();
	key.importKey(privateKey);

	const result = key.decrypt(buffer, type);
	return result;
};

module.exports = {Key: new RSA(), Decrypting};
