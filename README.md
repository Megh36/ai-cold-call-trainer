# AI Cold Call Trainer

A full-featured AI-powered cold call roleplay trainer built with React and Claude. Practice sales pitches against realistic AI prospects, get live coaching tips mid-call, and review detailed post-call analysis.

## Features

- **8 product categories** — SaaS, Real Estate, Marketing, Finance, Insurance, Recruiting, E-Commerce, Healthcare
- **40 pre-built prospects** — each with distinct personalities, objections, and difficulty levels
- **Custom categories & prospects** — build your own scenario with full personality control
- **Live in-call coaching tips** — AI coach gives you a prescriptive tip after every prospect reply
- **Gender-aware voice** — male/female voice selection using Web Speech API
- **Post-call scorecard** — scored on Opener, Objection Handling, Value Prop, and CTA
- **Call history** — persistent across sessions with skill averages and trend tracking
- **AI performance insights** — Claude analyzes your aggregate stats and gives coaching advice
- **Best Closer Alternatives** — on any past call, see what a world-class rep would have said instead
- **Reset history** — wipe all data and start fresh anytime
- **Mobile-ready** — fully responsive, iOS Safari audio fixes included

## Tech Stack

- React (JSX artifact)
- Claude Sonnet 4.6 via Anthropic API
- Web Speech API (SpeechSynthesis + SpeechRecognition)
- Claude Artifact persistent storage (`window.storage`)

## Running Locally / Deploying to Vercel

> The artifact version uses `window.storage` (Claude-specific) and direct browser → Anthropic API calls.
> For a standalone Vercel deployment, two changes are needed:
>
> 1. Replace `window.storage` with `localStorage`
> 2. Route Claude API calls through a Next.js API route (`/api/claude`) to keep your API key server-side
>
> Set `ANTHROPIC_API_KEY` as an environment variable on Vercel.

## Usage

1. Open the artifact in Claude
2. Pick a product category (or define your own)
3. Choose a prospect — or build a custom one with name, role, difficulty, personality traits, and objections
4. Start the call — type or speak your pitch
5. Live coaching tips appear after every prospect reply
6. End the call to see your scorecard and coaching tip
7. Open Call History to review past calls and generate Best Closer Alternatives

## Built By

Megh Patel & Bhavya Patel — [Waani](https://waani.ai)

---

*Part of the Waani ecosystem — AI voice agents for sales teams.*
