// index.js
// Frontend Test – AI Detection Results API implementation
// Implements fallback logic across ModelA -> ModelB -> ModelC
// Based on spec in uploaded PDF. :contentReference[oaicite:1]{index=1}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/*
  Simulate API calls - DO NOT MODIFY (kept from the starter code)
*/
const callModel = async (modelName, delay, successRate) => {
  await new Promise(r => setTimeout(r, delay));
  if (Math.random() > successRate) throw new Error(`${modelName} failed`);
  return {
    model: modelName,
    confidence: 0.5 + Math.random() * 0.5,
    result: Math.random() > 0.5 ? 'Human' : 'AI'
  };
};

const modelA = () => callModel('ModelA', 1000, 0.9);
const modelB = () => callModel('ModelB', 2000, 0.7);
const modelC = () => callModel('ModelC', 3000, 0.95);

/* Hardcoded question list (per spec) */
const QUESTIONS = [
  "Tell me about yourself",
  "Why this company?",
  "Greatest weakness?",
  "Describe a challenge you solved",
  "Where do you see yourself in 5 years?"
];

/* 
  detectForQuestion:
  - tries modelA, then B, then C
  - logs failed models
  - returns object with question, model, confidence, result, timeTaken
  - if all fail, returns object with error + failedModels + timeTaken
*/
async function detectForQuestion(question) {
  const start = Date.now();
  const failedModels = [];

  // Try Model A
  try {
    const res = await modelA();
    const timeTaken = Date.now() - start;
    return {
      question,
      model: res.model,
      confidence: Number(res.confidence.toFixed(2)),
      result: res.result,
      timeTaken
    };
  } catch (err) {
    failedModels.push(err.message);
    console.warn(`[Fallback] ${question} - ${err.message}`);
  }

  // Try Model B
  try {
    const res = await modelB();
    const timeTaken = Date.now() - start;
    return {
      question,
      model: res.model,
      confidence: Number(res.confidence.toFixed(2)),
      result: res.result,
      timeTaken
    };
  } catch (err) {
    failedModels.push(err.message);
    console.warn(`[Fallback] ${question} - ${err.message}`);
  }

  // Try Model C
  try {
    const res = await modelC();
    const timeTaken = Date.now() - start;
    return {
      question,
      model: res.model,
      confidence: Number(res.confidence.toFixed(2)),
      result: res.result,
      timeTaken
    };
  } catch (err) {
    failedModels.push(err.message);
    console.error(`[Fallback] ${question} - ${err.message}`);
  }

  // All failed
  const timeTaken = Date.now() - start;
  return {
    question,
    error: 'All models failed',
    failedModels,
    timeTaken
  };
}

/*
  GET /results
  - without query: returns array of results for all 5 questions
  - with query ?question=... (exact match, case-insensitive): returns single result object (500 if that single question all models failed)
*/
app.get('/results', async (req, res) => {
  const { question } = req.query;

  try {
    if (question) {
      // find exact question ignoring case
      const matched = QUESTIONS.find(q => q.toLowerCase() === question.toLowerCase());
      if (!matched) {
        return res.status(400).json({
          error: 'Question not found. Available questions (copy-paste exactly):',
          options: QUESTIONS
        });
      }
      const result = await detectForQuestion(matched);
      // If single-question and all models failed, return 500 (per spec: "If all fail, return an error")
      if (result.error && result.error === 'All models failed') {
        return res.status(500).json(result);
      }
      return res.json(result);
    } else {
      // All questions: run in parallel
      const tasks = QUESTIONS.map(q => detectForQuestion(q));
      const results = await Promise.all(tasks);
      return res.json(results);
    }
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// app.listen(PORT, () => {
//   console.log(`AI Detection Results API listening: http://localhost:${PORT}`);
// });

module.exports = { app, detectForQuestion };