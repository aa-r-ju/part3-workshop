console.log("Hello There")

const express = require('express');
let app = express();
const mongoose = require('mongoose')
const {url} = require("./utils/config")
const {errorHandler,noHandlers,requestLogger} = require("./utils/middleware")


const cors = require('cors')
app.use(express.json())
app.use(express.static("build"))
app.use(cors());
 app.use(requestLogger)



mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content:{
    type: String,
  minLength: 5,
  required:true
},
important:Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)








// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]
  
  app.get("/",(request, response) => {
    response.send("<h1>Hello World</h1>")
  })

  app.get("/api/notes",(request, response) => {
    Note.find({}).then((result)=> {
      response.json(result)

    })
})

app.get("/api/notes/:id",(request, response,next) => {
  Note.findById(request.params.id).then((result) => {
    if (result) {
      response.json(result)
  } else {
      response.status(404).send(`There are no notes at ${request.params.id}`)
  }
  }).catch(e => {
    next(e)
    // console.log(e)
    // response.status(500).send(`${request.params.id}is not in the required format`)
  })

    // const myId = Number(request.params.id)
    // const myNote = notes.find((note) => note.id === myId)

   
  })

  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true ,runValidators:true})
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  app.post('/api/notes', (request, response,next) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    }).catch(e => {
       next(e)    
})
  })
  
app.use(noHandlers)

  
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)


module.exports = app