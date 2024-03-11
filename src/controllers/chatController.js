import axios from "axios";
import asyncHandler from "express-async-handler";
import { createWriteStream, write } from "fs";
import ChatHistory from "../models/chatHistoryModel.js";
import Character from "../models/chtModel.js";
// import { OpenAI } from "langchain/llms/openai";
import "@langchain/openai";
// import { PromptTemplate } from "langchain/prompts";
import "@langchain/core/prompts"
import { LLMChain } from "langchain/chains";
import path from "path";

const createHistory = asyncHandler(async (req, res) => {
  const { user_id, cht_id, msg, send } = req.body;
  const chat = await ChatHistory.create({
    user_id,
    cht_id,
    userSend: send,
    content: msg,
  });
  if (chat) {
    res.status(200).json({ message: "success" });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  const { cht_id } = req.body;
  const chathistory = await ChatHistory.find({ cht_id: cht_id });
  if (chathistory) {
    res.status(200).json({ history: chathistory });
  }
});

const botRes = asyncHandler(async (req, res) => {
  const { user_id, cht_id, msg, send } = req.body;

  const characterInfo = await Character.findOne({ cht_id: cht_id });
  if (characterInfo) {
    const prompt_text = characterInfo.prompt;
    var history = "";
    var humanInput = msg;
    humanInput += "\n Please answer shortly.\n";
    const template = `${prompt_text}

          ${history}
          Boyfriend: ${humanInput}
          James:
          `;
    const prompt = new PromptTemplate({
      inputVariables: [history, humanInput],
      template: template,
    });
    const max_len = 100;
    const chatgptChain = new LLMChain({
      llm: new OpenAI({
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.2,
        max_tokens: max_len,
      }),
      prompt: prompt,
      // verbose: true,
      // memory: new BufferWindowMemory({ k: 2 }),
    });

    const output = await chatgptChain.predict({ humanInput: humanInput });
    history += "\nBoyfriend: " + humanInput + "\nJames: " + output;

    const chat = await ChatHistory.create({
      user_id,
      cht_id,
      userSend: send,
      //Change this part for bot response with open ai msg => output
      content: output,
    });

    if (chat) {
      res.status(200).json({
        voice_id: chat._id,
        msg: chat.content,
      });
    }
  }
});

const textToSpeech = asyncHandler(async (req, res) => {
  const { voice_id, text } = req.body;
  const payload = {
    model_id: process.env.MODEL_ID,
    text: text,
    voice_settings: {
      similarity_boost: 0.75,
      stability: 0.5,
    },
  };
  const headers = {
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.VOICE_ID}?output_format=mp3_22050_32`,
      payload,
      { headers, responseType: "stream" }
    );

    // console.log(response);

    const fileName = `public/${voice_id}.mp3`;
    const writeStream = createWriteStream(fileName);
    response.data.pipe(writeStream);
    writeStream.on("finish", async () => {
      console.log("File saved successfully");
      await ChatHistory.findByIdAndUpdate(voice_id, { voice_id: voice_id });

      res.json({
        voice_id: voice_id,
        message: "File saved successfully",
      });
    });
    writeStream.on("error", (error) => {
      console.error("Error saving file:", error);
      res.status(500).json({ message: "Error saving file" });
    });
  } catch (error) {
    console.log("Error in textToSpeech:", error);
    res.status(500).json({ message: "Error in textToSpeech" });
  }
});

const getVoice = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "public", `${id}.mp3`);

  const options = {
    headers: {
      "Content-Length": "123456", // Replace '123456' with the actual length of the audio file
      "Accept-Ranges": "bytes",
      "Content-Type": "audio/mpeg",
    },
  };
  res.sendFile(filePath, options);
});

export { textToSpeech, createHistory, botRes, getVoice, fetchChats };
