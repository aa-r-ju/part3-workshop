const app = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

app.get("/", async (request, response) => {
  let result = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(result);
});

app.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).send(`There are no notes at ${request.params.id}`);
      }
    })
    .catch((e) => {
      next(e);
    });
});

app.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

app.post("/", async (request, response, next) => {
  const body = request.body;

  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodedToken.id);

    const note = new Note({
      content: body.content,
      important: body.important || false,
      user: user._id,
    });
    const savedNote = await note.save();
    response.status(201).json(savedNote);
    user.notes = user.notes.concat(savedNote.id);
    await user.save();
  } catch (e) {
    next(e);
  }
});

module.exports = app;
