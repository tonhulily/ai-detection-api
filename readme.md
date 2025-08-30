# AI Detection Results API

This project implements a backend service that simulates AI detection results for interview questions.  
It follows the **Frontend Test – AI Detection Results API** specification provided in the task document.

---

## 📋 Features

- **Three AI Models (with delay + success rates):**
  - Model A → 1s delay, 90% success rate
  - Model B → 2s delay, 70% success rate
  - Model C → 3s delay, 95% success rate

- **Fallback Logic:**
  - Try Model A → if fails, try Model B → if fails, try Model C → if all fail, return error.

- **Returns for each request:**
  - `question`
  - `model` used
  - `confidence` (random 0.5–1.0)
  - `result` ("Human" or "AI")
  - `timeTaken` (ms)

- **Predefined Questions:**
  - Tell me about yourself
  - Why this company?
  - Greatest weakness?
  - Describe a challenge you solved
  - Where do you see yourself in 5 years?

- **API Endpoints:**
  - `GET /results` → results for all questions
  - `GET /results?question=...` → result for a single question (case-insensitive match)

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/tonhulily/ai-detection-api.git
cd ai-detection-api 
```

### 2. Install dependencies
```bash 
npm install express
```

### 3. Run the server
```bash
node server.js
```

### 4. Test the API
# Get results for all questions
```bash
http://localhost:3000/results
```

# Get result for a single question
```bash
"http://localhost:3000/results?question=Why this company?"
```


## 📊 Example Response
```json
[
  {
    "question": "Tell me about yourself",
    "model": "ModelA",
    "confidence": 0.83,
    "result": "Human",
    "timeTaken": 1023
  },
  {
    "question": "Why this company?",
    "model": "ModelB",
    "confidence": 0.67,
    "result": "AI",
    "timeTaken": 2070
  }
]
```

## ⚠️ Error Handling
> Note: If a single-question request fails on all models → returns 500 with:
```json
{
  "question": "Why this company?",
  "error": "All models failed",
  "failedModels": ["ModelA failed", "ModelB failed", "ModelC failed"],
  "timeTaken": 6003
}
```
> Note: If multiple questions are requested (/results) → each object includes its result or error.

## Running Unit Tests
We use Jest to test fallback logic. The code is in detect.test.js file.

# Run Tests
```bash
npx jest
```
# Expected output:
```bash
 PASS  test/detect.test.js
  ✓ detectForQuestion should return a result with model or error (1054 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.4 s
```

## FINAL NOTE: If you had 30 more minutes, what would you improve first?
I would add automated unit tests (e.g., using Jest) to verify the fallback logic and error handling.
This would ensure each model’s failure/success is properly handled and make the project more robust.



