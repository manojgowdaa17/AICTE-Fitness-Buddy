# Fitness Buddy 🏋️ – AI-Powered Health & Fitness Coach

> **AICTE Problem Statement #13** | Powered by **IBM Granite** on IBM Cloud watsonx.ai

Fitness Buddy is a conversational AI health and fitness assistant that provides on-demand, personalized:
- 🏠 **Home workout routines** tailored to your fitness level & goals
- 🥗 **Healthy meal ideas** and basic nutrition guidance  
- 💪 **Daily motivation** and fitness inspiration
- 📅 **Habit-building strategies** for consistency

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ — [Download](https://nodejs.org/)
- **IBM Cloud account** (Lite tier is free) — [Sign up](https://cloud.ibm.com/registration)
- **IBM watsonx.ai** project — [Get started](https://dataplatform.cloud.ibm.com/)

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd fitness-buddy
npm install
```

### 3. Configure IBM Cloud Credentials

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Edit `.env`:

```env
IBM_API_KEY=your_ibm_cloud_api_key        # IAM API key from cloud.ibm.com/iam/apikeys
IBM_PROJECT_ID=your_watsonx_project_id    # From watsonx.ai project settings
IBM_WML_URL=https://us-south.ml.cloud.ibm.com
IBM_GRANITE_MODEL=ibm/granite-3-8b-instruct
```

**How to get your credentials:**
1. **API Key**: Go to [IBM Cloud IAM](https://cloud.ibm.com/iam/apikeys) → Create API key
2. **Project ID**: Open [watsonx.ai](https://dataplatform.cloud.ibm.com) → Your project → Manage → General → Project ID
3. **WML URL**: Choose the URL for your region (Dallas, Frankfurt, London, or Tokyo)

### 4. Run the App
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
fitness-buddy/
├── server.js                  # Express app entry point
├── package.json
├── env.example                # Environment variable template
├── .env                       # Your secrets (never commit this!)
│
├── routes/
│   ├── chat.js                # POST /api/chat  &  GET /api/chat/welcome
│   └── health.js              # GET /api/health  (config check)
│
├── services/
│   ├── ibmGranite.js          # IBM watsonx.ai / Granite API wrapper
│   └── fitnessPrompts.js      # Prompt engineering & intent detection
│
└── public/
    └── index.html             # Single-page chat UI (vanilla JS)
```

---

## 🧠 IBM Granite Integration

This app uses the **IBM watsonx.ai text generation API** with the `ibm/granite-3-8b-instruct` model:

| Component | Details |
|-----------|---------|
| **Model** | `ibm/granite-3-8b-instruct` (configurable via `IBM_GRANITE_MODEL`) |
| **Auth** | IBM Cloud IAM token (auto-refreshed, cached) |
| **Endpoint** | `POST /ml/v1/text/generation?version=2023-05-29` |
| **Prompt format** | Granite instruct: `<\|system\|>`, `<\|user\|>`, `<\|assistant\|>` |

The system prompt primes Granite to act as a fitness coach. Intent detection (workout / nutrition / motivation / habit) adds per-request context hints to improve response quality.

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Config check — shows which env vars are set |
| `GET` | `/api/chat/welcome` | AI-generated welcome message |
| `POST` | `/api/chat` | Chat with Fitness Buddy |

### POST /api/chat

**Request body:**
```json
{
  "message": "Give me a 20-minute home workout",
  "history": [
    { "role": "user",      "content": "Hi!" },
    { "role": "assistant", "content": "Hello! I'm Fitness Buddy..." }
  ]
}
```

**Response:**
```json
{
  "reply": "Here's a great 20-minute home workout for you! ..."
}
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 Conversational chat | Multi-turn dialogue with conversation history |
| ⚡ Quick chips | One-click shortcuts for common fitness requests |
| 🧠 Intent detection | Automatically adapts prompts for workouts, meals, motivation |
| 📱 Responsive UI | Works on mobile and desktop |
| 🔒 Rate limiting | Protects the API from abuse |
| 🔄 Auto token refresh | IBM IAM tokens are cached and refreshed automatically |
| 🎯 Markdown rendering | Bot responses render bold, italic, and bullet lists |

---

## 🛡️ Security Notes

- Never commit your `.env` file (it's in `.gitignore`)
- API key is only used server-side — never exposed to the browser
- Rate limiting is enabled by default (100 req / 15 min per IP)

---

## 🏗️ Built With

- **IBM Granite** (`ibm/granite-3-8b-instruct`) via IBM watsonx.ai
- **IBM Cloud** – Lite tier (free)
- **Node.js** + **Express**
- Vanilla HTML/CSS/JS (zero frontend dependencies)

---

*Fitness Buddy is an AI assistant — not a substitute for professional medical or nutritional advice.*
