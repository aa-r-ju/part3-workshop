console.log("Hello There")

const express = require('express');
let app = express();
const mongoose = require('mongoose')
const {url} = require("./utils/config")
const notesController = require("./controllers/notes")
const {errorHandler,noHandlers,requestLogger} = require("./utils/middleware")
mongoose.set('strictQuery',false)
mongoose.connect(url)

console.log("NODE_ENV is",process.env.NODE_ENV)

const cors = require('cors')
app.use(express.json())
app.use(express.static("build"))
app.use(cors());
app.use(requestLogger)

app.use("/api/notes",notesController)
 
app.use(noHandlers)

app.use(errorHandler)


module.exports = app