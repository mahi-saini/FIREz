# FIREz 🐢

**Financial Independence, Retire Early — for Generation Z, in Zürich.**

FIREz is a soft, pastel-coloured personal-finance education and retirement-planning web app built for early-career women in Switzerland who feel scared or shut out by traditional investing. The "z" stands for Gen Z and Zürich. The guiding belief: you don't need CHF 20'000 to start learning — CHF 20 a month and a kind guide is enough.

> _"Financial freedom is not a sprint. Ember helps you move forward, one informed step at a time."_

---

## ✨ What's inside

| Page | Route | What it does |
|------|-------|--------------|
| **Home** | `/` | Welcoming hero, the three pillars at a glance, Ember intro, social proof |
| **Knowledge Hub** | `/knowledge` | Interactive tutorials on the Swiss three-pillar system, pensions, the stock market; daily mindset insights from books, podcasts and TED talks; a mini-simulator slider |
| **Simulator** | `/simulator` | A non-scary, pre-filled simulator: income, contribution, risk, career breaks → calm long-term ROI chart with exact CHF tax savings via Pillar 3a. Every projection is labelled a hypothetical illustration |
| **Community** | `/community` | Generational mentorship (Early Career 20s / Mid-Life 30s–40s / Wealth Preservation 50+), success stories, safe-space feed |
| **Events** | `/events` | Workshops filtered by Financial Readiness Level (1–4), each with a photo, plain-language description and "what to expect". Click a card to save a seat |
| **Ask Ember** | `/ember` | A real chat with Ember — the pastel-green turtle mascot — powered by the Lovable AI Gateway. She answers Swiss money questions in her warm, no-pressure voice, with built-in guardrails |
| **Onboarding** | `/onboarding` | Gentle multi-step profile builder (name, income, goals, risk, children, values) that feeds the simulator and Ember |
| **Data & Privacy** | `/data` | Plain-language explanation of what's stored where (localStorage on your device), with a one-click delete button |

---

## 🐢 Ember — your finance buddy

Ember is the mascot, not a chatbot face. She floats across the app as an easter egg with pastel tooltips, and on `/ember` she becomes a full chat companion.

- **Powered by** the Lovable AI Gateway (Google Gemini via `https://ai.gateway.lovable.dev`)
- **System prompt & guardrails** live in [`src/lib/ember-prompt.ts`](src/lib/ember-prompt.ts) — Ember's persona, Swiss-finance knowledge, verified event list, and partner comparison cards
- **Streaming chat endpoint** at [`src/routes/api/ember.ts`](src/routes/api/ember.ts)
- Ember will never: promise returns, guarantee outcomes, call anything risk-free, tell you to buy/sell a specific security, pressure you, or shame you. She provides **education and scenario exploration only** — not regulated financial, legal, or tax advice.

---

## 🇨🇭 Swiss-specific value

FIREz is built around realities that generic finance apps miss:

- The **three-pillar system** — Pillar 1 (AHV/AVS), Pillar 2 (BVG/LPP), Pillar 3a
- **Wealth tax** and the tax-deduction value of Pillar 3a contributions
- **Career breaks, maternity leave, and part-time work** — and their impact on 2nd/3rd pillar pension gaps
- **Fees in CHF** — TER, custody fees, stamp duty, currency-conversion spreads
- **Provider comparisons** with the same criteria for every provider (VIAC, finpension, Swissquote), never ranking a partner because it's a partner

---

## 🎨 Design system

Soft pastels only — peach, mint, lavender, pale blue, butter, blush. No dark or aggressive colours, no purple gradients on white.

- **Typography:** Quicksand (display) + Nunito (body)
- **Tone:** low-anxiety, encouraging, less wordy
- **Tokens:** defined as semantic theme variables in [`src/styles.css`](src/styles.css)
- **Imagery:** real, diverse women across ages and ethnicities

---

## 🛠 Tech stack

- **Framework:** TanStack Start v1 (full-stack React 19, SSR/SSG) on Vite 8
- **Routing:** TanStack Router (file-based, `src/routes/`)
- **Styling:** Tailwind CSS v4 (native `@import` + `@theme` in `src/styles.css`)
- **UI:** shadcn/ui components (Radix primitives) + Lucide icons
- **Charts:** Recharts
- **Notifications:** Sonner
- **AI:** Lovable AI Gateway (Google Gemini) for Ember chat
- **State:** user profile persisted to `localStorage` (no backend required to run the app)

---

## 🚀 Getting started

```sh
git clone <repository-url>
cd firez
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build (used for prerender) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

### Environment

Ember's chat needs a Lovable API key. In the Lovable editor it's injected automatically as `LOVABLE_API_KEY`. For local development, set it in your environment.

---

## 📁 Project structure

```
src/
├── assets/              # Generated & uploaded images (hero, women, events, learning)
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── Ember.tsx        # Floating mascot + tooltips
│   ├── EmberWelcome.tsx # 5-second onboarding popup
│   └── Layout.tsx       # Header (FIREz logo), nav, footer, floating Ember
├── lib/
│   ├── ember-prompt.ts  # Ember's system prompt, events & partner knowledge
│   ├── profile.ts       # User profile type, defaults, localStorage store, goals
│   └── utils.ts         # cn() helper
├── routes/
│   ├── __root.tsx       # Root layout, global styles, Toaster
│   ├── index.tsx        # Home
│   ├── knowledge.tsx    # Knowledge Hub
│   ├── simulator.tsx    # Personal Simulator
│   ├── community.tsx    # Community & mentorship
│   ├── events.tsx       # Events hub
│   ├── ember.tsx        # Ask Ember chat
│   ├── onboarding.tsx   # Profile onboarding
│   ├── data.tsx         # Data transparency & deletion
│   └── api/ember.ts     # Streaming chat endpoint (SSE proxy to AI Gateway)
├── styles.css           # Tailwind v4 theme tokens, pastel palette, animations
└── start.ts             # TanStack Start entry
```

---

## 🧠 Persona: Sarah

FIREz is designed around a real-feeling persona so every screen proves her small income is enough:

> **Sarah**, 23, part-time Sales Associate in Zürich, ~CHF 2'000/month. She thinks she needs CHF 20'000 to invest, feels false security from a big bank balance, is terrified of crashes, and her friends are broke or busy. The copy must reassure her — gently, without jargon or pressure.

---

## ⚠️ Important boundaries

FIREz and Ember provide **financial education and scenario exploration only**. They do **not** provide regulated financial, legal, or tax advice. Every projection is a hypothetical illustration; actual results may be higher or lower, and losses are possible. For decisions with significant consequences, consult a qualified Swiss financial or tax professional.

Provider comparisons use verified, same-criteria cards. Sponsorship never equals endorsement, and risks or costs are never hidden.

---

## 📄 License

This project was built with [Lovable](https://lovable.dev). The code is yours to own, modify, and deploy.
