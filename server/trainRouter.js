const express = require("express");
const app = express.Router();
const trainRouter = express.Router();
const axios = require("axios");

// Replace with your actual API key and endpoint
const GENERATE_ENDPOINT = "https://api.venice.ai/api/v1/video/queue";
const DISPLAY_ENDPOINT = "https://api.venice.ai/v1/display";

app.post("/generate", (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "wan-2.5-preview-image-to-video",
      prompt: "Commerce being conducted in the city of Venice, Italy.",
      duration: "5s",
      image_url: "http://firebasestorage.googleapis.com/v0/b/bate-mates.appspot.com/o/PjcNUNMIFcMCQmQyXC77tdR2tsZ2%2F5da95515-dd26-4913-8201-b2e016cf8baa?alt=media&token=06c6690d-e2ce-4a1c-8f82-dbfc6fcbde62",
      negative_prompt:
        "low resolution, error, worst quality, low quality, defects",
      aspect_ratio: "16:9",
      resolution: "720p",
      audio: true,
    }),
  };

  fetch("https://api.venice.ai/api/v1/video/queue", options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
});


module.exports = trainRouter;
