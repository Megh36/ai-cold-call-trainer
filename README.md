# AI Cold Call Trainer

**Live app → [ai-cold-call-trainer-omega.vercel.app](https://ai-cold-call-trainer-omega.vercel.app)**

A full-featured AI-powered cold call roleplay trainer. Practice your sales pitch against realistic AI prospects, get live coaching tips mid-call, and review detailed post-call analysis with best-closer alternatives.

---

## Features

- **8 product categories** — SaaS, Real Estate, Marketing, Finance, Insurance, Recruiting, E-Commerce, Healthcare
- **40 pre-built prospects** — each with distinct personalities, objections, and difficulty levels
- **Custom categories & prospects** — build your own scenario with full personality control (name, role, company, difficulty, personality traits, primary objection, warm signals)
- **Live in-call coaching tips** — AI coach gives you a prescriptive, technique-named tip after every prospect reply
- **Gender-aware voice** — male/female voice using Web Speech API with iOS Safari audio fixes
- **Post-call scorecard** — scored on Opener, Objection Handling, Value Proposition, and CTA & Close
- **Call history** — persistent across sessions with skill averages and trend tracking
- **AI performance insights** — Claude analyzes your aggregate stats and gives personalized coaching
- **Best Closer Alternatives** — on any past call, see what a world-class rep would have said at each turn
- **Call detail view** — full transcript and score breakdown for every session
- **Reset history** — wipe all data and start fresh anytime
- **Mobile-ready** — fully responsive, iOS Safari audio unlocking included

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Claude Sonnet 4.6** via Anthropic API (server-side route)
- **Web Speech API** — SpeechSynthesis + SpeechRecognition
- **localStorage** — persistent call history and custom scenarios
- **Vercel** — deployment

---

## How to Use

1. Visit **[ai-cold-call-trainer-omega.vercel.app](https://ai-cold-call-trainer-omega.vercel.app)**
2. Pick a product category — or define your own custom one
3. Choose a prospect — or build a custom one with full personality control
4. Start the call — type or speak your pitch
5. Live coaching tips appear beneath each prospect reply
6. End the call to see your full scorecard and coaching tip
7. Open **Call History** to review past sessions, track skill averages, and generate Best Closer Alternatives

---

## Deploy Your Own

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-cold-call-trainer.git
cd ai-cold-call-trainer

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key
cp .env.local.example .env.local
# Edit .env.local and add: ANTHROPIC_API_KEY=sk-ant-...

# 4. Run locally
npm run dev
# Open http://localhost:3000
```

**Deploy to Vercel:**
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy — Vercel auto-detects Next.js

---

## Project Structure

```
app/
├── api/
│   └── claude/
│       └── route.js      # Server-side Claude API proxy
├── globals.css
├── layout.jsx
└── page.jsx              # Full application
```

---

## Built By

**Megh Patel**
