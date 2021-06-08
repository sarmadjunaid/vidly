const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Return all genre
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// Return specific genre
router.get("/:id", auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res
      .status(404)
      .send(`The genre with the id: ${req.params.id} was not found`);

  res.send(genre);
});

// Create new genre
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

// Updating Genre
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res
      .status(404)
      .send(`The course with the id: ${req.params.id} was not found`);

  res.send(genre);
});

// Delete Genre
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id, {
    useFindAndModify: true,
  });

  if (!genre)
    return res
      .status(404)
      .send(`The course with the id: ${req.params.id} was not found`);

  res.send(genre);
});

module.exports = router;
