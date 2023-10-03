const app = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

app.get("/", async (request, response) => {
  let result = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  });
  response.json(result);
});

app.get("/:id", (request, response, next) => {
  User.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).send(`There are no users at ${request.params.id}`);
      }
    })
    .catch((e) => {
      next(e);
    });
});
app.post("/", async (request, response, next) => {
  const body = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    passwordHash,
    name: body.name,
  });
  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (e) {
    next(e);
  }
});

module.exports = app;
