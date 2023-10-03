const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const notesController = require("./controllers/notes");
const { url } = require("./utils/config");
const {
  errorHandler,
  noHandlers,
  requestLogger,
} = require("./utils/middleware");

mongoose.set("strictQuery", false);
mongoose.connect(url);

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(requestLogger);

app.use("/api/notes", notesController);

app.use(noHandlers);
app.use(errorHandler);

module.exports = app;
