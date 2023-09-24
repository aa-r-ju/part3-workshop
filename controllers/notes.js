const app = require("express").Router()
const Note = require("../models/note")


  app.get("/",async (request, response) => {
   let result = await Note.find({})
      response.json(result)
})

app.get("/:id",(request, response,next) => {
  Note.findById(request.params.id).then((result) => {
    if (result) {
      response.json(result)
  } else {
      response.status(404).send(`There are no notes at ${request.params.id}`)
  }
  }).catch(e => {
    next(e)
  })
   
  })

  app.put('/:id', (request, response, next) => {
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

  app.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  app.post('/', (request, response,next) => {
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


  module.exports = app;