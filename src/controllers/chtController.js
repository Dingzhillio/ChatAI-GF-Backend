import asyncHandler from "express-async-handler";
import Character from "../models/chtModel.js";

const createCht = asyncHandler(async (req, res) => {
  const { name, cht_id, prompt } = req.body;

  const CharacterInfo = await Character.findOne({ cht_id: cht_id });

  if (CharacterInfo) {
    res.status(404);
    throw new Error("Character already exists");
  }

  const character = await Character.create({ name, cht_id, prompt });

  if (character) {
    res.status(201).json({
      _id: character._id,
      name: character.name,
      cht_id: character.cht_id,
      prompt: character.prompt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Character data");
  }
});

const getCht = asyncHandler(async (req, res) => {
  const { cht_id } = req.body;

  if (cht_id) {
    const characterInfo = await Character.findOne({cht_id: cht_id})
    res.status(200).json({character: characterInfo});
  }
});

export { createCht, getCht };
