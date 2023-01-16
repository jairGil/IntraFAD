let express = require("express");
let path = require("path");
let logger = require("morgan");
//const cors = require('cors');

const documentoRouter = require("./routes/documento");
const imagenRouter = require("./routes/imagen");

let app = express();

//app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/documento",documentoRouter);
app.use("/api/imagen",imagenRouter);
module.exports = app;