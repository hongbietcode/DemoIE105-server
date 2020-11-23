const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
// const portHttps = 443;
const portHttp = process.env.PORT || 80;

const router = require("./router");
const SocketIO = require("./services/socketIO");

require("dotenv").config();
require("./services/connectDatabase");

const httpServer = require("http").createServer(app);

//app set middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use("/api", router);
app.use(express.static(__dirname));

new SocketIO(httpServer);

httpServer.listen(portHttp, () => {
	console.log(`listen on http://localhost:${portHttp}`);
});
