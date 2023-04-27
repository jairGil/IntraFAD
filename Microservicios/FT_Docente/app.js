let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");

let datoAcademicoRouter = require("./routes/datoAcademico");
let certificacionRouter = require("./routes/certificacion");
let cursoRouter = require("./routes/curso");
let idiomaRouter = require("./routes/idioma");
let publicacionRouter = require("./routes/publicacion");
let experienciaRouter = require("./routes/experiencia");

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/api/datos_academicos", datoAcademicoRouter);
app.use("/api/certificaciones", certificacionRouter);
app.use("/api/cursos", cursoRouter);
app.use("/api/idiomas", idiomaRouter);
app.use("/api/publicaciones", publicacionRouter);
app.use("/api/experiencias", experienciaRouter);

//idioma aquí

module.exports = app;
