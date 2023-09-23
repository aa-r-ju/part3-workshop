const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')
  
    expect(response.body).toHaveLength(initialNotes.length)
  })
  
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
  
    expect(response.body[0].content).toBe(initialNotes[0].content)
  })

afterAll(async () => {
  await mongoose.connection.close()
})