"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, X, ChevronLeft, ChevronRight, Heart, Flame, Download } from "lucide-react";
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
    faceConfig: {
      top: "13.1%", left: "-12.2%", width: "29.8%", height: "29.8%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(0.95) contrast(1.05)",
    },
  },
  {
    id: 2,
    question: "You need space?",
    revealText: "Space....I see :)",
    emoji: "🚀",
    image: "/images/astronaut.png",
    faceTarget: "sender",
    faceConfig: {
      top: "24.1%", left: "80.4%", width: "19.6%", height: "19.6%",
      shape: "50% / 48%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(1.0) contrast(1.1)",
    },
  },
  {
    id: 3,
    question: "You need time?",
    revealText: "take your time.",
    emoji: "⏰",
    image: "/images/clock.png",
    faceTarget: "sender",
    faceConfig: {
      top: "4%", left: "16%", width: "60%", height: "54%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.65,
      filter: "brightness(1.05) contrast(1.0)",
    },
  },
  {
    id: 4,
    question: "You are my world?",
    revealText: "you're literally my world !!!",
    emoji: "🌍",
    image: "/images/earth.png",
    faceTarget: "receiver",
    faceConfig: {
      top: "8%", left: "12%", width: "76%", height: "76%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.55,
      filter: "brightness(1.1) contrast(1.0)",
    },
  },
  {
    id: 5,
    question: "You need to heal?",
    revealText: "take your time princess and i am sorry",
    emoji: "🩹",
    image: "/images/bandaid.png",
    faceTarget: "sender",
    faceConfig: {
      top: "28%", left: "28%", width: "42%", height: "42%",
      shape: "8px",
      blendMode: "normal",
      opacity: 0.92,
      filter: "brightness(1.0) contrast(1.05)",
      rotate: "-40deg",
    },
  },
  {
    id: 6,
    question: "You want distance?",
    revealText: "Measured. Confirmed. Noted 📏",
    emoji: "📏",
    image: "/images/ruler.png",
    faceTarget: "sender",
    faceConfig: {
      top: "30%", left: "8%", width: "30%", height: "30%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(1.0) contrast(1.05)",
    },
  },
  {
    id: 7,
    question: "You need a break?",
    revealText: "fine :(",
    emoji: "🍫",
    image: "/images/kitkat.png",
    faceTarget: "sender",
    faceConfig: {
      top: "22%", left: "15%", width: "70%", height: "38%",
      shape: "4px",
      blendMode: "normal",
      opacity: 0.85,
      filter: "brightness(1.05) contrast(1.05)",
    },
  },
  {
    id: 8,
    question: "I drive you crazy?",
    revealText: "congrats you won you saw something noone ever did",
    emoji: "🚗",
    image: "/images/steering.png",
    faceTarget: "sender",
    faceConfig: {
      top: "28%", left: "33%", width: "34%", height: "32%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(1.0) contrast(1.05)",
    },
  },
  {
    id: 9,
    question: "You're my sunshine?",
    revealText: "You literally light up my world",
    emoji: "☀️",
    image: "/images/sun.png",
    faceTarget: "receiver",
    faceConfig: {
      top: "30%", left: "30%", width: "40%", height: "40%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(1.2) contrast(1.05)",
    },
  },
  {
    id: 10,
    question: "You want to ghost me?",
    revealText: "fine ghost me but from today onwards even death can't do us apart",
    emoji: "👻",
    image: "/images/ghost.png",
    faceTarget: "sender",
    faceConfig: {
      top: "14%", left: "18%", width: "62%", height: "58%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
      filter: "brightness(1.0) contrast(1.05)",
      behindImage: true,
    },
  },
];

function CloudIntro({ onReady, senderNickname }: { onReady: () => void; senderNickname?: string }) {
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
        initial={{ y: 400, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.0, duration: 1.0, type: "spring", stiffness: 80, damping: 14 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.5, type: "spring" }}
          className="mb-4 bg-white rounded-2xl px-6 py-4 shadow-2xl relative"
          style={{ maxWidth: "280px" }}
        >
          <p className="text-gray-800 text-base font-bold text-center leading-snug">
            🌷 These are for you 🌷
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
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
          style={{ fontSize: "0px", lineHeight: 0 }}
        >
          <svg width="260" height="320" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="42" r="24" fill="#C68642"/>
            <circle cx="36" cy="42" r="15" fill="#E8A96A"/>
            <circle cx="144" cy="42" r="24" fill="#C68642"/>
            <circle cx="144" cy="42" r="15" fill="#E8A96A"/>
            <circle cx="90" cy="72" r="48" fill="#C68642"/>
            <circle cx="90" cy="72" r="30" fill="#E8A96A"/>
            <circle cx="76" cy="64" r="7" fill="#3B1F0A"/>
            <circle cx="104" cy="64" r="7" fill="#3B1F0A"/>
            <circle cx="78" cy="61" r="3" fill="white"/>
            <circle cx="106" cy="61" r="3" fill="white"/>
            <ellipse cx="90" cy="76" rx="6" ry="5" fill="#3B1F0A"/>
            <path d="M80 86 Q90 96 100 86" stroke="#3B1F0A" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <ellipse cx="90" cy="162" rx="44" ry="50" fill="#C68642"/>
            <ellipse cx="90" cy="162" rx="28" ry="32" fill="#E8A96A"/>
            <path d="M46 138 Q16 122 10 100" stroke="#C68642" strokeWidth="22" strokeLinecap="round" fill="none"/>
            <path d="M134 138 Q164 128 168 110" stroke="#C68642" strokeWidth="22" strokeLinecap="round" fill="none"/>
            <ellipse cx="66" cy="208" rx="18" ry="13" fill="#C68642"/>
            <ellipse cx="114" cy="208" rx="18" ry="13" fill="#C68642"/>
            <path d="M-8 95 L30 60 L52 95 Z" fill="#E8F5E9" opacity="0.9"/>
            <path d="M-8 95 L52 95 L42 115 L8 115 Z" fill="#C8E6C9"/>
            <path d="M8 115 L42 115" stroke="#A5D6A7" strokeWidth="1.5"/>
            <line x1="6" y1="95" x2="4" y2="20" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="26" y1="90" x2="28" y2="14" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="46" y1="93" x2="52" y2="18" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="14" y1="92" x2="12" y2="10" stroke="#33691E" strokeWidth="3" strokeLinecap="round"/>
            <line x1="34" y1="88" x2="36" y2="6" stroke="#33691E" strokeWidth="3" strokeLinecap="round"/>
            <line x1="20" y1="95" x2="18" y2="16" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round"/>
            <line x1="40" y1="94" x2="44" y2="12" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M12 65 Q2 55 4 42 Q16 54 12 65Z" fill="#388E3C"/>
            <path d="M10 62 Q22 52 24 40 Q12 50 10 62Z" fill="#43A047"/>
            <path d="M32 60 Q22 48 26 36 Q38 50 32 60Z" fill="#2E7D32"/>
            <path d="M30 58 Q42 46 40 32 Q28 46 30 58Z" fill="#388E3C"/>
            <path d="M18 72 Q6 62 8 50 Q20 62 18 72Z" fill="#43A047"/>
            <path d="M48 68 Q58 56 54 42 Q42 56 48 68Z" fill="#388E3C"/>
            <ellipse cx="4" cy="14" rx="6" ry="10" fill="#AD1457"/>
            <ellipse cx="28" cy="8" rx="7" ry="11" fill="#E91E63"/>
            <ellipse cx="52" cy="12" rx="6" ry="10" fill="#880E4F"/>
            <ellipse cx="12" cy="4" rx="7" ry="11" fill="#C2185B"/>
            <ellipse cx="36" cy="-1" rx="8" ry="12" fill="#F06292" transform="translate(0,4)"/>
            <ellipse cx="18" cy="9" rx="8" ry="12" fill="#E91E63"/>
            <ellipse cx="44" cy="5" rx="7" ry="11" fill="#F48FB1"/>
            <ellipse cx="-2" cy="18" rx="5" ry="8" fill="#D81B60"/>
            <ellipse cx="58" cy="16" rx="5" ry="8" fill="#EC407A"/>
            <ellipse cx="16" cy="5" rx="2.5" ry="5" fill="#F8BBD0" opacity="0.7"/>
            <ellipse cx="4" cy="10" rx="2" ry="4" fill="#F8BBD0" opacity="0.6"/>
            <ellipse cx="36" cy="3" rx="2.5" ry="5" fill="#F8BBD0" opacity="0.6"/>
            <ellipse cx="26" cy="4" rx="2" ry="4" fill="#FCE4EC" opacity="0.7"/>
            <ellipse cx="60" cy="20" rx="4" ry="6" fill="#F48FB1" opacity="0.9"/>
          </svg>
        </motion.div>
      </motion.div>

      {[...Array(14)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="absolute text-3xl select-none pointer-events-none"
          style={{ left: `${8 + i * 6.5}%`, top: "110%" }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, -300 - Math.random() * 200],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180 + Math.random() * 180],
            x: [0, (Math.random() - 0.5) * 80],
          }}
          transition={{
            delay: 2.2 + i * 0.12,
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
          {senderNickname ? `${senderNickname} has something to show you…` : "Your partner has something to show you…"}
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

const SCENE_FACE_CONFIG: Record<string, { cx: number; cy: number; r: number; imgW: number; imgH: number; behindImage?: boolean; shape?: "circle" | "rect"; rectW?: number; rectH?: number; rotate?: number }> = {
  sofa:      { cx: 274,  cy: 244,  r: 155, imgW: 1372, imgH: 872 },
  astronaut: { cx: 1027, cy: 304,  r: 88,  imgW: 1334, imgH: 896 },
  clock:     { cx: 415,  cy: 335,  r: 220, imgW: 831,  imgH: 1109 },
  earth:     { cx: 640,  cy: 476,  r: 280, imgW: 1278, imgH: 952 },
  bandaid:   { cx: 530,  cy: 480,  r: 0,   imgW: 1112, imgH: 1049, shape: "rect", rectW: 320, rectH: 180, rotate: -40 },
  ruler:     { cx: 220,  cy: 310,  r: 130, imgW: 1102, imgH: 868 },
  kitkat:    { cx: 460,  cy: 210,  r: 0,   imgW: 1028, imgH: 763, shape: "rect", rectW: 580, rectH: 200, rotate: 0 },
  steering:  { cx: 640,  cy: 420,  r: 170, imgW: 1316, imgH: 908 },
  sun:       { cx: 350,  cy: 320,  r: 130, imgW: 698,  imgH: 680 },
  ghost:     { cx: 570,  cy: 430,  r: 220, imgW: 1232, imgH: 960, behindImage: true },
};

async function compositeOnCanvas(bgSrc: string, faceSrc: string, sceneName: string): Promise<string> {
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

        if (config.behindImage) {
          ctx.save();
          ctx.beginPath();
          const faceR = config.r * scale;
          ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
          ctx.clip();
          const fScale = Math.max((faceR * 2) / faceImg.naturalWidth, (faceR * 2) / faceImg.naturalHeight);
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.drawImage(faceImg, faceCX - fdw / 2, faceCY - fdh / 2, fdw, fdh);
          ctx.restore();
          ctx.globalAlpha = 0.9;
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.globalAlpha = 1;
        } else if (config.shape === "rect") {
          const rw = (config.rectW || 200) * scale;
          const rh = (config.rectH || 200) * scale;
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.save();
          ctx.translate(faceCX, faceCY);
          if (config.rotate) ctx.rotate((config.rotate * Math.PI) / 180);
          ctx.beginPath();
          ctx.rect(-rw / 2, -rh / 2, rw, rh);
          ctx.clip();
          const fScale = Math.max(rw / faceImg.naturalWidth, rh / faceImg.naturalHeight);
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.drawImage(faceImg, -fdw / 2, -fdh / 2, fdw, fdh);
          ctx.restore();
        } else {
          const faceR = config.r * scale;
          ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
          ctx.save();
          ctx.beginPath();
          ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
          ctx.clip();
          const fScale = Math.max((faceR * 2) / faceImg.naturalWidth, (faceR * 2) / faceImg.naturalHeight);
          const fdw = faceImg.naturalWidth * fScale;
          const fdh = faceImg.naturalHeight * fScale;
          ctx.drawImage(faceImg, faceCX - fdw / 2, faceCY - fdh / 2, fdw, fdh);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(faceCX, faceCY, faceR + 2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        const result = canvas.toDataURL("image/jpeg", 0.92);
        resolve(result);
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

function ReactionBar({ slideId, onReact }: { slideId: number; onReact: (slideId: number, type: "heart" | "fire") => void }) {
  const [reacted, setReacted] = useState<"heart" | "fire" | null>(null);
  const handleReact = (type: "heart" | "fire") => {
    if (reacted) return;
    setReacted(type);
    onReact(slideId, type);
    if (navigator.vibrate) navigator.vibrate(40);
  };
  return (
    <div className="flex items-center gap-3 mt-2">
      <motion.button
        whileTap={{ scale: 1.4 }}
        onClick={() => handleReact("heart")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${reacted === "heart" ? "bg-pink-500/30 border-pink-400/60 text-pink-300" : "glass border-white/20 text-white/60 hover:text-pink-300"}`}
      >
        <Heart className={`w-4 h-4 ${reacted === "heart" ? "fill-pink-400 text-pink-400" : ""}`} />
        {reacted === "heart" ? "Loved it!" : "❤️"}
      </motion.button>
      <motion.button
        whileTap={{ scale: 1.4 }}
        onClick={() => handleReact("fire")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${reacted === "fire" ? "bg-orange-500/30 border-orange-400/60 text-orange-300" : "glass border-white/20 text-white/60 hover:text-orange-300"}`}
      >
        <Flame className={`w-4 h-4 ${reacted === "fire" ? "fill-orange-400 text-orange-400" : ""}`} />
        {reacted === "fire" ? "🔥 fire!" : "🔥"}
      </motion.button>
    </div>
  );
}

function SlideCard({
  question, senderUrl, receiverUrl, onNext, onPrev, onExit, index, total, senderNickname, onReact,
}: {
  question: typeof QUESTIONS[0];
  senderUrl: string | null;
  receiverUrl: string | null;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  index: number;
  total: number;
  senderNickname?: string;
  onReact: (slideId: number, type: "heart" | "fire") => void;
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
      if (dx < 0) { onNext(); if (navigator.vibrate) navigator.vibrate(50); }
      else { onPrev(); if (navigator.vibrate) navigator.vibrate(50); }
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
      .then(dataUrl => { setCompositeSrc(dataUrl === "__css_fallback__" ? null : dataUrl); setLoading(false); })
      .catch(() => setLoading(false));
  }, [question.id, faceUrl]);

  const revealText = senderNickname
    ? question.revealText.replace("Space....I see :)", `Space....I see :) — ${senderNickname}`)
    : question.revealText;

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
      <div className="w-full flex items-center gap-2 mb-5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= index ? "bg-primary" : "bg-white/20"}`} />
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-6"
      >
        {question.question}
      </motion.h2>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10"
        style={{ aspectRatio: "1" }}
      >
        {loading ? (
          <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading…</div>
          </div>
        ) : compositeSrc ? (
          <img src={compositeSrc} alt={question.question} className="w-full h-full object-cover" />
        ) : (
          <img src={question.image} alt={question.question} className="w-full h-full object-cover" />
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
        className="text-white/80 text-base font-medium text-center mt-5 mb-3"
      >
        {revealText}
      </motion.p>

      <ReactionBar slideId={question.id} onReact={onReact} />

      {index === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: 1.5, duration: 2.5 }}
          className="text-white/40 text-xs mt-2"
        >
          ← swipe to navigate →
        </motion.p>
      )}

      <div className="flex items-center gap-4 w-full mt-4">
        <Button variant="outline" onClick={onPrev} disabled={index === 0} className="flex-1 h-12 rounded-xl glass border-white/20 text-white disabled:opacity-30">
          <ChevronLeft className="w-5 h-5 mr-1" />Prev
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-white">
          {index === total - 1 ? "Done 🎉" : "Next"}
          {index < total - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
        </Button>
      </div>

      <button onClick={onExit} className="mt-4 text-white/40 hover:text-white/70 transition-colors text-sm flex items-center gap-1">
        <X className="w-3 h-3" />Exit
      </button>
    </motion.div>
  );
}

export default function MemeRevealScreen({ userData, onNavigate }: MemeRevealScreenProps) {
  const [phase, setPhase] = useState<"intro" | "slideshow" | "exit">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [reactions, setReactions] = useState<Record<number, "heart" | "fire">>({});

  const senderUrl = userData.selfieUrl;
  const receiverUrl = userData.partnerSelfieUrl;
  const senderNickname = userData.nickname;

  const stopAudio = () => {
    const audio = (window as any).__bgAudio as HTMLAudioElement | undefined;
    if (audio) { audio.pause(); audio.currentTime = 0; (window as any).__bgAudio = null; }
  };

  const handleExit = () => { stopAudio(); onNavigate("final"); };

  const handleNext = () => {
    if (currentIndex === QUESTIONS.length - 1) { setPhase("exit"); }
    else { setCurrentIndex((i) => i + 1); if (navigator.vibrate) navigator.vibrate(50); }
  };

  const handlePrev = () => {
    if (currentIndex > 0) { setCurrentIndex((i) => i - 1); if (navigator.vibrate) navigator.vibrate(50); }
  };

  const handleReact = async (slideId: number, type: "heart" | "fire") => {
    setReactions((prev) => ({ ...prev, [slideId]: type }));
    try {
      const token = (userData as any).token || userData.shareLink?.split("/share/")[1];
      if (token) {
        const existing = await supabase.from("meme_sessions").select("reactions").eq("token", token).single();
        const prev = (existing?.data?.reactions as Record<string, string>) || {};
        await supabase.from("meme_sessions").update({ reactions: { ...prev, [slideId]: type } }).eq("token", token);
      }
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    stopAudio();
    try {
      const token = (userData as any).token || userData.shareLink?.split("/share/")[1];
      if (token) await supabase.from("meme_sessions").update({ private_message: message }).eq("token", token);
    } catch (e) { console.error(e); }
    setMessageSent(true);
    setShowMessage(false);
  };

  const handleShowMessage = () => { stopAudio(); setShowMessage(true); };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === "intro" && <CloudIntro onReady={() => setPhase("slideshow")} senderNickname={senderNickname} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "slideshow" && (
          <motion.div key="slideshow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center justify-center min-h-screen py-10">
            <AnimatePresence mode="wait">
              <SlideCard
                key={currentIndex}
                question={QUESTIONS[currentIndex]}
                senderUrl={senderUrl}
                receiverUrl={receiverUrl}
                onNext={handleNext}
                onPrev={handlePrev}
                onExit={() => { stopAudio(); setPhase("exit"); }}
                index={currentIndex}
                total={QUESTIONS.length}
                senderNickname={senderNickname}
                onReact={handleReact}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "exit" && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border/40 rounded-t-3xl p-6 shadow-2xl">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            {messageSent ? (
              <div className="text-center space-y-4">
                <p className="text-primary font-semibold text-lg">Message sent 🔒 Only they can see it</p>
                <Button size="lg" onClick={() => handleExit()} className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary rounded-xl">Exit</Button>
              </div>
            ) : !showMessage ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">Before you go…</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">Leave a private message for {userData.nickname || "them"}? Only they can see it 🔒</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleExit()} className="flex-1 h-11 rounded-xl border-border/50">Skip & Exit</Button>
                  <Button onClick={handleShowMessage} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold">
                    <Lock className="w-4 h-4 mr-2" />Write message
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">Private message</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Only {userData.nickname || "they"} can see this 💬</p>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type something honest... or chaotic 🔥" rows={4} className="w-full rounded-xl border border-border/60 bg-muted/40 p-3 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors" />
                <div className="flex gap-3 mt-3">
                  <Button variant="outline" onClick={() => setShowMessage(false)} className="flex-1 h-11 rounded-xl border-border/50">Back</Button>
                  <Button onClick={handleSendMessage} disabled={!message.trim()} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold">
                    <Send className="w-4 h-4 mr-2" />Send
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
