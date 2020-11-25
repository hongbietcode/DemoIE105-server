const mongoose = require("mongoose");

class Database {
	constructor() {
		this._connect();
	}
	_connect() {
		mongoose.set("useNewUrlParser", true);
		mongoose.set("useFindAndModify", false);
		mongoose.set("useCreateIndex", true);
		mongoose
			.connect(process.env.CONNECT_STRING_PUBLIC, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log("✅  Database connection successfully");
			})
			.catch(() => {
				console.log("❌  Database connection failed");
			});
	}
}

module.exports = new Database();
