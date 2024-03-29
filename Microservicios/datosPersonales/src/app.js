
/* CORE MODULES */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');

/* USER MODULES */
const docenteRouter = require("./routes/docentes");


const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/docentes", docenteRouter);

module.exports = app;
