# LITERALLY ME 💀
### Turn Your Face Into Emotional Damage

> A viral couple meme web app — send your partner a unique link, have them upload their selfie, and watch as both your faces get dropped into a series of chaotic, relationship-coded memes.

🔗 **[instagram-couple-trend.vercel.app](https://instagram-couple-trend.vercel.app/)**

---

## ✨ How It Works

1. **You** upload a selfie and enter your nickname
2. A **unique shareable link** is generated just for you
3. **Send the link** to your partner
4. Your partner uploads *their* selfie
5. Both faces get composited into a series of meme reveals
6. You both get to witness the chaos 🎉

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animations | Framer Motion |
| Storage | Supabase (PostgreSQL + Storage + Realtime) |
| Analytics | Vercel Analytics |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                       # Root app — screen state machine
│   ├── layout.tsx                     # Metadata, fonts, analytics
│   ├── globals.css                    # Global styles & CSS variables
│   └── share/[token]/page.tsx         # Partner link landing page
│
├── components/
│   ├── screens/
│   │   ├── landing-screen.tsx         # Entry point with floating memes + particle field
│   │   ├── upload-selfie-screen.tsx   # Initiator selfie upload
│   │   ├── link-generated-screen.tsx  # Share link display
│   │   ├── waiting-screen.tsx         # Polls Supabase for partner upload
│   │   ├── partner-landing-screen.tsx # Partner's entry page
│   │   ├── partner-upload-screen.tsx  # Partner selfie upload
│   │   ├── meme-reveal-screen.tsx     # The main meme carousel
│   │   └── final-screen.tsx           # End screen + share result
│   └── ui/                            # shadcn/ui + custom components
│       ├── floating-memes.tsx
│       ├── particle-field.tsx
│       ├── confetti-explosion.tsx
│       └── ... (35+ components)
│
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/
│   ├── supabase.ts                    # Supabase client
│   └── utils.ts
│
└── public/
    ├── images/                        # Meme template PNGs
    │   ├── astronaut.png, clock.png, sofa.png ...
    └── rude.mp3                       # Sound effect
```

---

## 🧩 Screen Flow

```
landing → upload-selfie → link-generated → waiting
                                               ↓
         share/[token] → partner-landing → partner-upload → meme-reveal → final
```

All screen transitions are managed via a `useState` state machine in `app/page.tsx` with Framer Motion's `AnimatePresence` for animated transitions.

---

## ☁️ Deployment

Deployed on **[Vercel](https://vercel.com)** with **[Supabase](https://supabase.com)** as the storage and database backend.


### Supabase Setup

- **Storage bucket** — for selfie uploads (set to public read)
- **Sessions table** — stores `token`, `selfie_url`, `partner_selfie_url`, `nickname`, `private_message`
- **Realtime** — enabled on the sessions table so the waiting screen can live-poll for partner completion

---

## 👨‍💻 Developer

Built by **Shrish Sharan** — 2026
