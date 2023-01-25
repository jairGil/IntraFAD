let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");

let datoAcademicoRouter = require("./routes/datoAcademico");
let certificacionRouter = require("./routes/certificacion");
let cursoRouter = require("./routes/curso");
//ruta de idioma aquí

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/api/dato_academico", datoAcademicoRouter);
app.use("/api/certificacion", certificacionRouter);
app.use("/api/curso", cursoRouter);
//idioma aquí

module.exports = app;
