/** *** CORE MODULES *** **/
let express = require("express");
let path = require("path");
let logger = require("morgan");
const cors = require('cors');
const bodyParser = require("body-parser");

/* ROUTERS */
const documentoRouter = require("./routes/documento");
const imagenRouter = require("./routes/imagen");

let app = express();

/* MIDDLEWARES */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* ROUTES */
app.use("/api/documento",documentoRouter);
app.use("/api/imagen",imagenRouter);
module.exports = app;