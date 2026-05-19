# 🐺 Wolf of Almaty Street

> *From street vendor to market predator. Bluff, negotiate, dominate.*

A satirical 2D trading & negotiation web game set in the streets of Almaty, Kazakhstan. Inspired by the aggressive capitalism of "The Wolf of Wall Street" — but make it local.

---

## 🎮 About the Game

You start as a broke street vendor selling absolute garbage — *Air from Nurota*, *Broken iPhone 6 (sold as vintage)*, *Medeo Rust Chips* — and must bluff, negotiate, and hustle your way to becoming the **Wolf of Al-Farabi**.

Every client lowballs you. Some are scammers in disguise. Contracts worth thousands are on the table. And the clock is always ticking.

**Can you hit your daily target before the day ends?**

---

## ✨ Features

- 🤝 **Negotiation System** — Every client has a personality (Aggressive, Friendly, Stubborn, Impulsive). Hold firm, discount, pitch value or walk away
- 🕵️ **Scammer Detection** — Hidden scammers disguised as clients. Spot their red flags and counter-pitch to steal their deal
- 📋 **Contracts** — High-value deals up to $8,000 requiring Charisma and 2-step closing
- ⏱️ **Day Timer** — 3 difficulty modes: Hardcore (3 min), Normal (5 min), Rookie (10 min)
- 📊 **End of Day Report** — Daily earnings, rank title, best deal, streaks
- 🏆 **Live Multiplayer Leaderboard** — Real-time rankings via Supabase
- ⚔️ **Raid System** — Spend $500 to send a scammer to another player's next deal
- 💾 **Auto-save** — Progress saved to localStorage automatically
- 🎭 **45+ unique clients** — All Almaty-themed with backstories and personalities
- 🏅 **6 rank tiers** — Rookie Hustler → Baraholka Regular → Street Operator → Almaty Shark → Market Wolf → Wolf of Al-Farabi

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Multiplayer | Supabase Realtime |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/wolf-of-almaty.git
cd wolf-of-almaty
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Project Settings → API** and copy your keys

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start hustling.

---

## 🎯 How to Play

1. **Pick an item** from your inventory — everything has a hidden cost price
2. **A client appears** with an opening offer (always too low)
3. **Negotiate** using one of 4 actions each round:
   - **Hold Firm** — keep your price, client patience drops
   - **−10% Discount** — small concession, buys patience
   - **−25% Discount** — big drop, saves the deal but cuts margin
   - **Pitch Value ⚡** — bluff using Focus Energy to boost perceived value
   - **Walk Away** — 30% chance client calls back with better offer
4. **Watch for scammers** — they look like normal clients but steal from you if you sell. Spot red flag phrases and use Counter-Pitch to reverse the deal
5. **Hit your daily target** — 3 days of losses in a row = Game Over

---

## 📁 Project Structure

```
wolf-of-almaty/
├── app/
│   ├── page.tsx           # Main Menu
│   ├── game/page.tsx      # Game Dashboard
│   ├── how-to-play/       # Tutorial page
│   └── leaderboard/       # Global rankings
├── components/
│   ├── GameDashboard.tsx
│   ├── ClientCard.tsx
│   ├── Inventory.tsx
│   ├── EndOfDayModal.tsx
│   └── Leaderboard.tsx
├── hooks/
│   └── useGameState.ts    # Core game logic
├── lib/
│   ├── supabase.ts
│   └── gameData.ts        # Items, clients, scammers, contracts
└── supabase/
    └── schema.sql
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables (same as `.env.local`)
4. Click **Deploy**

Your game will be live at `your-project.vercel.app` in ~2 minutes.

---

## 🗺 Roadmap

- [ ] Mobile responsive layout
- [ ] Sound effects (mechanical keyboard clicks)
- [ ] Daily challenges
- [ ] Season system with resets
- [ ] Achievement badges
- [ ] Boss fight: The Aghashka from Al-Farabi

---

## 📄 License

MIT License — feel free to fork, remix, and hustle.

---

*Built with ☕ and pure Almaty energy.*









