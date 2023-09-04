console.log("Hello There")

const express = require('express');
const { request } = require('http');
let app = express();
const cors = require('cors')
app.use(express.json())
app.use(express.static("build"))
app.use(cors());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('we just wrote this code')
    next()
  }
  app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  
  app.get("/",(request, response) => {
    response.send("<h1>Hello World</h1>")
  })

  app.get("/api/notes",(request, response) => {
  response.json(notes)
})

app.get("/api/notes/:id",(request, response) => {
    const myId = Number(request.params.id)
    const myNote = notes.find((note) => note.id === myId)

    if (myNote) {
        response.json(myNote)
    } else {
        response.status(404).send(`There are no notes at ${myId}`)
    }
  })

  app.put('/api/notes/:id', (request, response) => {
    const resourceId = Number(request.params.id);
    const updatedData = request.body;
   notes =  notes.map(note => note.id !== resourceId ? note : updatedData)
    response.json(updatedData);
  });

  app.delete("/api/notes/:id",(request, response) => {
    const myId = Number(request.params.id)
     notes = notes.filter((note) => note.id !== myId)

    response.status(204).send(`The notes at ${myId} has been deleted`)
  })
  app.post("/api/notes",(request,response) => {
    const myNewPost = request.body;
    myNewPost.id = notes.length + 1
    notes.push(myNewPost)
    response.status(201).json(myNewPost)
});
  
app.use((request, response, next) => {
    response.status(404).send("no code available to handle this request")
  })

const PORT = process.env.PORT ? process.env.PORT: 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`)