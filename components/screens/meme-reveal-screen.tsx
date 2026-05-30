"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import { supabase } from "@/lib/supabase";

interface MemeRevealScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: "You can't stand me?",
    revealText: "Okay.... there you go sit on me 🫦",
    emoji: "🪑",
    image: "/images/sofa.png",
    faceTarget: "sender",
  },
  {
    id: 2,
    question: "You need space?",
    revealText: "Space....I see :)",
    emoji: "🚀",
    image: "/images/astronaut.png",
    faceTarget: "sender",
  },
  {
    id: 3,
    question: "You need time?",
    revealText: "take your time.",
    emoji: "⏰",
    image: "/images/clock.png",
    faceTarget: "sender",
  },
  {
    id: 4,
    question: "You are my world?",
    revealText: "you're literally my world !!!",
    emoji: "🌍",
    image: "/images/earth.png",
    faceTarget: "receiver",
  },
  {
    id: 5,
    question: "You need to heal?",
    revealText: "take your time princess and i am sorry",
    emoji: "🩹",
    image: "/images/bandaid.png",
    faceTarget: "sender",
  },
  {
    id: 6,
    question: "You want distance?",
    revealText: "Measured. Confirmed. Noted 📏",
    emoji: "📏",
    image: "/images/ruler.png",
    faceTarget: "sender",
  },
  {
    id: 7,
    question: "You need a break?",
    revealText: "fine :(",
    emoji: "🍫",
    image: "/images/kitkat.png",
    faceTarget: "sender",
  },
  {
    id: 8,
    question: "I drive you crazy?",
    revealText: "congrats you won you saw something noone ever did",
    emoji: "🚗",
    image: "/images/steering.png",
    faceTarget: "sender",
  },
  {
    id: 9,
    question: "You're my sunshine?",
    revealText: "You literally light up my world",
    emoji: "☀️",
    image: "/images/sun.png",
    faceTarget: "receiver",
  },
  {
    id: 10,
    question: "You want to ghost me?",
    revealText: "fine ghost me but from today onwards even death can't do us apart",
    emoji: "👻",
    image: "/images/ghost.png",
    faceTarget: "sender",
  },
];

function CloudIntro({
  onReady,
  senderNickname,
}: {
  onReady: () => void;
  senderNickname?: string;
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!audioRef.current) {
        audioRef.current = new Audio("/rude.mp3");
        audioRef.current.volume = 0.6;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        (window as any).__bgAudio = audioRef.current;
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
        />
      ))}

      <motion.div
        className="absolute text-[120px] select-none"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "-55vw", opacity: 0 }}
        transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
        style={{ top: "38%", left: "10%" }}
      >
        ☁️
      </motion.div>

      <motion.div
        className="absolute text-[120px] select-none"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "55vw", opacity: 0 }}
        transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
        style={{ top: "38%", right: "10%" }}
      >
        ☁️
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 select-none"
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 2.0,
          duration: 1.0,
          type: "spring",
          stiffness: 80,
          damping: 14,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.5, type: "spring" }}
          className="mb-4 bg-white rounded-2xl px-6 py-4 shadow-2xl relative"
          style={{ maxWidth: "280px" }}
        >
          <p className="text-gray-800 text-base font-bold text-center leading-snug">
            🌷 These fresh TULIPS are for you 🌷
          </p>
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "12px solid white",
            }}
          />
        </motion.div>

        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.2,
          }}
          style={{ fontSize: "0px", lineHeight: 0 }}
        >
          <svg
            width="340"
            height="420"
            viewBox="0 0 220 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* TEDDY BEAR */}
            <circle cx="44" cy="52" r="28" fill="#C68642" />
            <circle cx="44" cy="52" r="18" fill="#E8A96A" />
            <circle cx="176" cy="52" r="28" fill="#C68642" />
            <circle cx="176" cy="52" r="18" fill="#E8A96A" />
            <circle cx="110" cy="88" r="58" fill="#C68642" />
            <circle cx="110" cy="88" r="38" fill="#E8A96A" />
            <circle cx="94" cy="78" r="9" fill="#3B1F0A" />
            <circle cx="126" cy="78" r="9" fill="#3B1F0A" />
            <circle cx="96" cy="75" r="3.5" fill="white" />
            <circle cx="128" cy="75" r="3.5" fill="white" />
            <ellipse cx="110" cy="94" rx="7" ry="6" fill="#3B1F0A" />
            <path
              d="M98 106 Q110 118 122 106"
              stroke="#3B1F0A"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="110" cy="205" rx="54" ry="62" fill="#C68642" />
            <ellipse cx="110" cy="205" rx="34" ry="40" fill="#E8A96A" />
            <path
              d="M56 170 Q20 150 12 124"
              stroke="#C68642"
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M164 170 Q200 158 206 138"
              stroke="#C68642"
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="82" cy="262" rx="22" ry="16" fill="#C68642" />
            <ellipse cx="138" cy="262" rx="22" ry="16" fill="#C68642" />

            {/* STEMS */}
            <line x1="10" y1="138" x2="-4" y2="62" stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="18" y1="136" x2="10" y2="50" stroke="#388E3C" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="26" y1="134" x2="24" y2="38" stroke="#33691E" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="132" x2="38" y2="28" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="132" x2="52" y2="24" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="134" x2="66" y2="26" stroke="#33691E" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="58" y1="136" x2="80" y2="32" stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" />

            {/* LEAVES */}
            <path d="M16 108 Q4 92 8 76 Q20 90 16 108Z" fill="#43A047" />
            <path d="M22 104 Q34 88 30 72 Q18 86 22 104Z" fill="#388E3C" />
            <path d="M38 94 Q52 76 48 60 Q36 76 38 94Z" fill="#2E7D32" />
            <path d="M48 88 Q36 74 40 58 Q52 72 48 88Z" fill="#43A047" opacity="0.8" />

            {/* RIBBON */}
            <path d="M4 138 Q34 133 62 138" fill="none" stroke="#E91E63" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M5 141 Q34 136 61 141" fill="none" stroke="#C2185B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            <path d="M26 135 Q14 120 7 125 Q1 130 12 136 Q20 139 26 135Z" fill="#F48FB1" stroke="#E91E63" strokeWidth="0.8" />
            <path d="M38 135 Q50 120 57 125 Q63 130 52 136 Q44 139 38 135Z" fill="#F48FB1" stroke="#E91E63" strokeWidth="0.8" />
            <ellipse cx="32" cy="136" rx="5" ry="4.5" fill="#E91E63" stroke="#C2185B" strokeWidth="0.8" />
            <path d="M28 139 Q22 150 18 160" fill="none" stroke="#E91E63" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M36 139 Q42 150 44 161" fill="none" stroke="#E91E63" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M18 160 L14 164 L22 163Z" fill="#E91E63" />
            <path d="M44 161 L48 165 L40 165Z" fill="#E91E63" />

            {/* TULIP 1 */}
            <g transform="translate(-4, 62)">
              <path d="M-3 2 Q0 -4 3 2" fill="#2E7D32" />
              <path d="M-6 0 Q-7 -10 0 -15 Q7 -10 6 0 Q3 4 0 4 Q-3 4 -6 0Z" fill="#AD1457" />
              <path d="M-6 0 Q-12 -8 -9 -16 Q-4 -12 -6 0Z" fill="#C2185B" />
              <path d="M6 0 Q12 -8 9 -16 Q4 -12 6 0Z" fill="#C2185B" />
              <ellipse cx="-1" cy="-10" rx="2" ry="4" fill="#FCE4EC" opacity="0.45" />
            </g>

            {/* TULIP 2 */}
            <g transform="translate(10, 50)">
              <path d="M-3 2 Q0 -4 3 2" fill="#2E7D32" />
              <path d="M-6 0 Q-7 -11 0 -17 Q7 -11 6 0 Q3 4 0 4 Q-3 4 -6 0Z" fill="#E91E63" />
              <path d="M-6 0 Q-13 -9 -10 -18 Q-4 -13 -6 0Z" fill="#F06292" />
              <path d="M6 0 Q13 -9 10 -18 Q4 -13 6 0Z" fill="#F06292" />
              <ellipse cx="-1" cy="-11" rx="2" ry="4.5" fill="#FCE4EC" opacity="0.45" />
            </g>

            {/* TULIP 3 */}
            <g transform="translate(24, 38)">
              <path d="M-3 2 Q0 -5 3 2" fill="#33691E" />
              <path d="M-7 0 Q-8 -12 0 -19 Q8 -12 7 0 Q4 5 0 5 Q-4 5 -7 0Z" fill="#D81B60" />
              <path d="M-7 0 Q-15 -10 -11 -20 Q-5 -14 -7 0Z" fill="#E91E63" />
              <path d="M7 0 Q15 -10 11 -20 Q5 -14 7 0Z" fill="#E91E63" />
              <ellipse cx="-1" cy="-12" rx="2.5" ry="5" fill="#FCE4EC" opacity="0.5" />
            </g>

            {/* TULIP 4 - center tallest */}
            <g transform="translate(38, 28)">
              <path d="M-3 2 Q0 -5 3 2" fill="#2E7D32" />
              <path d="M-8 0 Q-9 -13 0 -21 Q9 -13 8 0 Q4 6 0 6 Q-4 6 -8 0Z" fill="#E91E63" />
              <path d="M-8 0 Q-17 -11 -13 -22 Q-5 -15 -8 0Z" fill="#EC407A" />
              <path d="M8 0 Q17 -11 13 -22 Q5 -15 8 0Z" fill="#EC407A" />
              <path d="M0 -4 Q1 -12 0 -20" fill="none" stroke="#C2185B" strokeWidth="0.6" opacity="0.5" />
              <ellipse cx="0" cy="-13" rx="3" ry="6" fill="#FCE4EC" opacity="0.4" />
            </g>

            {/* TULIP 5 */}
            <g transform="translate(52, 24)">
              <path d="M-3 2 Q0 -5 3 2" fill="#33691E" />
              <path d="M-7 0 Q-8 -12 0 -19 Q8 -12 7 0 Q4 5 0 5 Q-4 5 -7 0Z" fill="#C2185B" />
              <path d="M-7 0 Q-15 -10 -11 -20 Q-5 -14 -7 0Z" fill="#D81B60" />
              <path d="M7 0 Q15 -10 11 -20 Q5 -14 7 0Z" fill="#D81B60" />
              <ellipse cx="-1" cy="-12" rx="2.5" ry="5" fill="#FCE4EC" opacity="0.5" />
            </g>

            {/* TULIP 6 */}
            <g transform="translate(66, 26)">
              <path d="M-3 2 Q0 -4 3 2" fill="#388E3C" />
              <path d="M-6 0 Q-7 -11 0 -17 Q7 -11 6 0 Q3 4 0 4 Q-3 4 -6 0Z" fill="#EC407A" />
              <path d="M-6 0 Q-13 -9 -10 -18 Q-4 -13 -6 0Z" fill="#F06292" />
              <path d="M6 0 Q13 -9 10 -18 Q4 -13 6 0Z" fill="#F06292" />
              <ellipse cx="-1" cy="-11" rx="2" ry="4.5" fill="#FCE4EC" opacity="0.4" />
            </g>

            {/* TULIP 7 */}
            <g transform="translate(80, 32)">
              <path d="M-3 2 Q0 -4 3 2" fill="#2E7D32" />
              <path d="M-6 0 Q-7 -10 0 -15 Q7 -10 6 0 Q3 4 0 4 Q-3 4 -6 0Z" fill="#AD1457" />
              <path d="M-6 0 Q-12 -8 -9 -16 Q-4 -12 -6 0Z" fill="#C2185B" />
              <path d="M6 0 Q12 -8 9 -16 Q4 -12 6 0Z" fill="#C2185B" />
              <ellipse cx="-1" cy="-10" rx="2" ry="4" fill="#FCE4EC" opacity="0.4" />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {[...Array(22)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="absolute text-3xl select-none pointer-events-none"
          style={{ left: `${3 + i * 4.5}%`, top: "110%" }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, -350 - Math.random() * 200],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180 + Math.random() * 180],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            delay: 2.2 + i * 0.1,
            duration: 2.5 + Math.random(),
            ease: "easeOut",
          }}
        >
          🌷
        </motion.div>
      ))}

      <motion.div
        className="text-center z-10 px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
        transition={{ delay: 0.3, duration: 4, times: [0, 0.2, 0.6, 1] }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Are you ready? 👀
        </motion.h1>
        <p className="text-white/60 text-lg">
          {senderNickname && senderNickname !== "babe"
            ? `${senderNickname} has something to show you…`
            : "Your partner has something to show you…"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8 }}
        className="mt-10 z-30"
      >
        <Button
          size="lg"
          onClick={onReady}
          className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-secondary rounded-2xl"
        >
          I'm ready 💜
        </Button>
      </motion.div>
    </motion.div>
  );
}

const SCENE_FACE_CONFIG: Record
  string,
  {
    cx: number;
    cy: number;
    r: number;
    imgW: number;
    imgH: number;
    behindImage?: boolean;
    shape?: "circle" | "rect";
    rectW?: number;
    rectH?: number;
    rotate?: number;
    faceOpacity?: number;
  }
> = {
  sofa:      { cx: 274, cy: 244, r: 155, imgW: 1372, imgH: 872 },
  astronaut: { cx: 1020, cy: 298, r: 82, imgW: 1334, imgH: 896 },
  clock:     { cx: 415, cy: 335, r: 220, imgW: 831, imgH: 1109, faceOpacity: 0.65 },
  // earth: raised opacity so face is darker and more visible
  earth:     { cx: 640, cy: 476, r: 280, imgW: 1278, imgH: 952, faceOpacity: 0.55 },
  // bandaid: centered on the pad square, tilted -40deg to match bandaid angle
  bandaid:   { cx: 556, cy: 524, r: 0, imgW: 1112, imgH: 1049, shape: "rect", rectW: 280, rectH: 280, rotate: -40, faceOpacity: 0.95 },
  ruler:     { cx: 220, cy: 310, r: 130, imgW: 1102, imgH: 868 },
  // kitkat: smaller, lower, faded so chocolate bars show through
  kitkat:    { cx: 460, cy: 310, r: 0, imgW: 1028, imgH: 763, shape: "rect", rectW: 340, rectH: 220, rotate: 0, faceOpacity: 0.55 },
  // steering: NOT behind image, circle above the logo, always visible
  steering:  { cx: 658, cy: 290, r: 110, imgW: 1316, imgH: 908, behindImage: false, faceOpacity: 0.92 },
  sun:       { cx: 349, cy: 340, r: 160, imgW: 698, imgH: 680 },
  ghost:     { cx: 570, cy: 380, r: 190, imgW: 1232, imgH: 960, behindImage: false, faceOpacity: 0.92 },
};

async function compositeOnCanvas(
  bgSrc: string,
  faceSrc: string,
  sceneName: string
): Promise<string> {
  return new Promise((resolve) => {
    const config = SCENE_FACE_CONFIG[sceneName];
    if (!config) { resolve(bgSrc); return; }

    const CARD = 600;
    const scale = Math.max(CARD / config.imgW, CARD / config.imgH);
    const offsetX = (config.imgW * scale - CARD) / 2;
    const offsetY = (config.imgH * scale - CARD) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = CARD;
    canvas.height = CARD;
    const ctx = canvas.getContext("2d")!;

    const bgImg = new Image();
    const faceImg = new Image();
    bgImg.crossOrigin = "anonymous";
    faceImg.crossOrigin = "anonymous";

    let bgLoaded = false;
    let faceLoaded = false;

    const tryDraw = () => {
      if (!bgLoaded || !faceLoaded) return;
      try {
        const faceCX = config.cx * scale - offsetX;
        const faceCY = config.cy * scale - offsetY;
        const faceAlpha = config.faceOpacity ?? 0.92;

        if (config.behindImage) {
          ctx.save();
          ctx.beginPath();
          const faceR = config.r * scale;
          ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
          ctx.clip();
          const fScale = Math.max(
            (faceR * 2) / faceImg.naturalWidth,
            (faceR * 2) / faceImg.naturalHeight
          );
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.globalAlpha = faceAlpha;
          ctx.drawImage(faceImg, faceCX - fdw / 2, faceCY - fdh / 2, fdw, fdh);
          ctx.restore();
          ctx.globalAlpha = 0.92;
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.globalAlpha = 1;
        } else if (config.shape === "rect") {
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.save();
          ctx.translate(faceCX, faceCY);
          if (config.rotate) ctx.rotate((config.rotate * Math.PI) / 180);
          const rw = (config.rectW || 200) * scale;
          const rh = (config.rectH || 200) * scale;
          ctx.beginPath();
          ctx.rect(-rw / 2, -rh / 2, rw, rh);
          ctx.clip();
          const fScale = Math.max(
            rw / faceImg.naturalWidth,
            rh / faceImg.naturalHeight
          );
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.globalAlpha = faceAlpha;
          ctx.drawImage(faceImg, -fdw / 2, -fdh / 2, fdw, fdh);
          ctx.restore();
          ctx.globalAlpha = 1;
        } else {
          const faceR = config.r * scale;
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.save();
          ctx.beginPath();
          ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
          ctx.clip();
          const fScale = Math.max(
            (faceR * 2) / faceImg.naturalWidth,
            (faceR * 2) / faceImg.naturalHeight
          );
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.globalAlpha = faceAlpha;
          ctx.drawImage(faceImg, faceCX - fdw / 2, faceCY - fdh / 2, fdw, fdh);
          ctx.restore();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(faceCX, faceCY, faceR + 2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
        resolve("__css_fallback__");
      }
    };

    bgImg.onerror = () => resolve("__css_fallback__");
    faceImg.onerror = () => resolve("__css_fallback__");
    bgImg.onload = () => { bgLoaded = true; tryDraw(); };
    faceImg.onload = () => { faceLoaded = true; tryDraw(); };
    bgImg.src = bgSrc;
    faceImg.src = faceSrc;
    setTimeout(() => resolve("__css_fallback__"), 8000);
  });
}

function SlideCard({
  question,
  senderUrl,
  receiverUrl,
  onNext,
  onPrev,
  onExit,
  index,
  total,
  senderNickname,
}: {
  question: (typeof QUESTIONS)[0];
  senderUrl: string | null;
  receiverUrl: string | null;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  index: number;
  total: number;
  senderNickname?: string;
}) {
  const faceUrl = question.faceTarget === "receiver" ? receiverUrl : senderUrl;
  const [compositeSrc, setCompositeSrc] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && dy < 80) {
      if (dx < 0) {
        onNext();
        if (navigator.vibrate) navigator.vibrate(50);
      } else {
        onPrev();
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  React.useEffect(() => {
    if (!faceUrl) { setLoading(false); return; }
    setLoading(true);
    setCompositeSrc(null);
    const sceneName = question.image.replace("/images/", "").replace(".png", "");
    compositeOnCanvas(question.image, faceUrl, sceneName)
      .then((dataUrl) => {
        setCompositeSrc(dataUrl === "__css_fallback__" ? null : dataUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [question.id, faceUrl]);

  let revealText = question.revealText;
  if (senderNickname && senderNickname !== "babe") {
    revealText = revealText.replace(
      "Space....I see :)",
      `Space....I see :) — ${senderNickname}`
    );
  }

  const handleSaveSlide = () => {
    if (!compositeSrc) return;
    const a = document.createElement("a");
    a.href = compositeSrc;
    a.download = `slide-${question.id}.jpg`;
    a.click();
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex flex-col items-center w-full max-w-sm mx-auto px-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar + counter */}
      <div className="w-full flex items-center gap-2 mb-5">
        <div className="flex items-center gap-1 flex-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= index ? "bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <span className="text-white/50 text-xs font-medium shrink-0 ml-2">
          {index + 1} / {total}
        </span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-4"
      >
        {question.question}
      </motion.h2>

      {/* Square image card — responsive on both mobile and desktop */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10"
        style={{ aspectRatio: "1 / 1" }}
      >
        {loading ? (
          <>
            <img
              src={question.image}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white"
              />
            </div>
          </>
        ) : compositeSrc ? (
          <img
            src={compositeSrc}
            alt={question.question}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={question.image}
            alt={question.question}
            className="w-full h-full object-cover"
          />
        )}
        {compositeSrc && (
          <button
            onClick={handleSaveSlide}
            className="absolute bottom-3 right-3 glass rounded-full p-2 border border-white/20 hover:bg-white/20 transition-all"
            title="Save this slide"
          >
            <Download className="w-4 h-4 text-white/70" />
          </button>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-white/80 text-base font-medium text-center mt-4 mb-4"
      >
        {revealText}
      </motion.p>

      {index === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: 1.5, duration: 2.5 }}
          className="text-white/40 text-xs mb-3"
        >
          ← swipe to navigate →
        </motion.p>
      )}

      <div className="flex items-center gap-3 w-full mt-1">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={index === 0}
          className="flex-1 h-12 rounded-xl glass border-white/20 text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Prev
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-white"
        >
          {index === total - 1 ? "Done 🎉" : "Next"}
          {index < total - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
        </Button>
      </div>

      <button
        onClick={onExit}
        className="mt-4 text-white/40 hover:text-white/70 transition-colors text-sm flex items-center gap-1"
      >
        <X className="w-3 h-3" />
        Exit
      </button>
    </motion.div>
  );
}

export default function MemeRevealScreen({
  userData,
  onNavigate,
}: MemeRevealScreenProps) {
  const [phase, setPhase] = useState<"intro" | "slideshow" | "exit">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const senderUrl = userData.selfieUrl;
  const receiverUrl = userData.partnerSelfieUrl;
  const senderNickname = userData.nickname;

  const stopAudio = () => {
    const audio = (window as any).__bgAudio as HTMLAudioElement | undefined;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      (window as any).__bgAudio = null;
    }
  };

  const notifySender = async () => {
    try {
      const token =
        (userData as any).token ||
        userData.shareLink?.split("/share/")[1];
      if (token) {
        await supabase
          .from("meme_sessions")
          .update({ receiver_finished: true })
          .eq("token", token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExit = () => {
    stopAudio();
    onNavigate("final");
  };

  const handleNext = () => {
    if (currentIndex === QUESTIONS.length - 1) {
      notifySender();
      setPhase("exit");
    } else {
      setCurrentIndex((i) => i + 1);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    stopAudio();
    try {
      const token =
        (userData as any).token ||
        userData.shareLink?.split("/share/")[1];
      if (token) {
        await supabase
          .from("meme_sessions")
          .update({ private_message: message })
          .eq("token", token);
      }
    } catch (e) {
      console.error(e);
    }
    setMessageSent(true);
    setShowMessage(false);
  };

  const handleShowMessage = () => {
    stopAudio();
    setShowMessage(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === "intro" && (
          <CloudIntro
            onReady={() => setPhase("slideshow")}
            senderNickname={senderNickname}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "slideshow" && (
          <motion.div
            key="slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center min-h-screen py-8 px-2"
          >
            {/* Constrain width on desktop so it looks good on large screens */}
            <div className="w-full max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                <SlideCard
                  key={currentIndex}
                  question={QUESTIONS[currentIndex]}
                  senderUrl={senderUrl}
                  receiverUrl={receiverUrl}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onExit={() => {
                    stopAudio();
                    notifySender();
                    setPhase("exit");
                  }}
                  index={currentIndex}
                  total={QUESTIONS.length}
                  senderNickname={senderNickname}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "exit" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border/40 rounded-t-3xl p-6 shadow-2xl max-w-lg mx-auto"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            {messageSent ? (
              <div className="text-center space-y-4">
                <p className="text-primary font-semibold text-lg">
                  Message sent 🔒 Only they can see it
                </p>
                <Button
                  size="lg"
                  onClick={handleExit}
                  className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary rounded-xl"
                >
                  Exit
                </Button>
              </div>
            ) : !showMessage ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">Before you go…</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Leave a private message for{" "}
                  {senderNickname && senderNickname !== "babe"
                    ? senderNickname
                    : "them"}
                  ? Only they can see it 🔒
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleExit}
                    className="flex-1 h-11 rounded-xl border-border/50"
                  >
                    Skip & Exit
                  </Button>
                  <Button
                    onClick={handleShowMessage}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Write message
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">Private message</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Only{" "}
                  {senderNickname && senderNickname !== "babe"
                    ? senderNickname
                    : "they"}{" "}
                  can see this 💬
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type something honest... or chaotic 🔥"
                  rows={4}
                  className="w-full rounded-xl border border-border/60 bg-muted/40 p-3 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors"
                />
                <div className="flex gap-3 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowMessage(false)}
                    className="flex-1 h-11 rounded-xl border-border/50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                  }
