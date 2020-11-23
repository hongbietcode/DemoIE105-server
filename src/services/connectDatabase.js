const mongoose = require("mongoose");

class Database {
	constructor() {
		this._connect();
	}
	_connect() {
		mongoose
			.connect(process.env.CONNECT_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
			.then(() => {
				console.log("Database connection successfully");
			})
			.catch(() => {
				console.log("Database connection failed");
			});
	}
}

module.exports = new Database();
