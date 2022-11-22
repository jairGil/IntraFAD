let express = require("express");
let path = require("path");
let logger = require("morgan");
const cors = require('cors');

let documentoRouter = require("./routes/documento");

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/documento",documentoRouter);


module.exports = app;