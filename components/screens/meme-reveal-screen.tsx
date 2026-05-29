"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import { supabase } from "@/lib/supabase";

interface MemeRevealScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

// faceConfig controls how the face is composited onto each scene.
// shape: CSS border-radius string (e.g. "50%" = circle, "12px" = rounded rect, "50% / 40%" = ellipse)
// blendMode: "normal" for fully visible, or a CSS mix-blend-mode for special cases
// opacity: 1 = fully visible, lower only where intentional
// filter: minimal — just brightness/contrast tweaks, no heavy saturation removal
// top/left/width/height: % positioning within the square card
const QUESTIONS = [
  {
    id: 1,
    question: "You can't stand me?",
    revealText: "Okay.... there you go sit on me 🫦",
    emoji: "🪑",
    image: "/images/sofa.png",
    faceTarget: "sender",
    // Empty left recliner — face on the seat, below the backrest
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
    // Helmet visor — dark reflective oval, upper right of the astronaut
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
    // Clock face dial — large cream circle occupying top 55% of image
    faceConfig: {
      top: "4%", left: "16%", width: "60%", height: "54%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.88,
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
    // Full earth sphere — face overlaid as large transparent circle on globe center
    faceConfig: {
      top: "8%", left: "12%", width: "76%", height: "76%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.75,
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
    // Bandaid is diagonal — gauze pad is a rotated square in the center
    faceConfig: {
      top: "28%", left: "28%", width: "42%", height: "42%",
      shape: "12px",
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
    // Ruler goes diagonal — face floats on the top flat face, left side
    faceConfig: {
      top: "22%", left: "12%", width: "34%", height: "34%",
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
    // KitKat bars stacked — face on top of the chocolate, center
    faceConfig: {
      top: "10%", left: "28%", width: "40%", height: "40%",
      shape: "50%",
      blendMode: "normal",
      opacity: 0.95,
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
    // Steering wheel center hub — circular, sits at roughly 35-65% horizontal, 35-68% vertical
    faceConfig: {
      top: "34%", left: "32%", width: "36%", height: "34%",
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
    // Inner golden sun circle — sits lower-center in the artwork
    faceConfig: {
      top: "37.9%", left: "43.1%", width: "27.9%", height: "27.9%",
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
    // Ghost body center — face renders behind, ghost PNG on top at 82% opacity
    faceConfig: {
      top: "30%", left: "22%", width: "56%", height: "52%",
      shape: "50%",
      blendMode: "normal",
      opacity: 1.0,
      filter: "brightness(1.0) contrast(1.05)",
      behindImage: true,
    },
  },
];

// Cloud splitting intro
function CloudIntro({ onReady }: { onReady: () => void }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Start song when clouds split (delay matches cloud animation: 1.5s)
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

  // Store audio ref on window so slideshow can keep it playing
  React.useEffect(() => {
    return () => {
      // Don't stop on unmount — keep playing through slides
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
      {/* Stars */}
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

      {/* Left cloud */}
      <motion.div
        className="absolute text-[120px] select-none"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "-55vw", opacity: 0 }}
        transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
        style={{ top: "38%", left: "10%" }}
      >
        ☁️
      </motion.div>

      {/* Right cloud */}
      <motion.div
        className="absolute text-[120px] select-none"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: "55vw", opacity: 0 }}
        transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
        style={{ top: "38%", right: "10%" }}
      >
        ☁️
      </motion.div>

      {/* Are you ready text */}
      <motion.div
        className="text-center z-10 px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Are you ready? 👀
        </motion.h1>
        <p className="text-white/60 text-lg">
          Your partner has something to show you…
        </p>
      </motion.div>

      {/* Button appears after clouds split */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="mt-10 z-10"
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

// Per-scene face placement config (pixel coords in original image)
const SCENE_FACE_CONFIG: Record<string, { cx: number; cy: number; r: number; imgW: number; imgH: number; behindImage?: boolean }> = {
  sofa:      { cx: 274,  cy: 244,  r: 155, imgW: 1372, imgH: 872 },
  astronaut: { cx: 1027, cy: 304,  r: 88,  imgW: 1334, imgH: 896 },
  clock:     { cx: 415,  cy: 335,  r: 290, imgW: 831,  imgH: 1109 },
  earth:     { cx: 640,  cy: 476,  r: 400, imgW: 1278, imgH: 952 },
  bandaid:   { cx: 530,  cy: 480,  r: 160, imgW: 1112, imgH: 1049 },
  ruler:     { cx: 300,  cy: 240,  r: 130, imgW: 1102, imgH: 868 },
  kitkat:    { cx: 460,  cy: 200,  r: 160, imgW: 1028, imgH: 763 },
  steering:  { cx: 640,  cy: 460,  r: 175, imgW: 1316, imgH: 908 },
  sun:       { cx: 397,  cy: 353,  r: 95,  imgW: 698,  imgH: 680 },
  ghost:     { cx: 570,  cy: 530,  r: 220, imgW: 1232, imgH: 960, behindImage: true },
};

// Client-side canvas compositing — works on Vercel, no server needed
async function compositeOnCanvas(
  bgSrc: string,
  faceSrc: string,
  sceneName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const config = SCENE_FACE_CONFIG[sceneName];
    if (!config) return reject("Unknown scene");

    const CARD = 600; // output canvas size

    // Calculate object-cover scale
    const scale = Math.max(CARD / config.imgW, CARD / config.imgH);
    const offsetX = (config.imgW * scale - CARD) / 2;
    const offsetY = (config.imgH * scale - CARD) / 2;

    // Face circle position in card pixels
    const faceCX = config.cx * scale - offsetX;
    const faceCY = config.cy * scale - offsetY;
    const faceR  = config.r * scale;

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

      if (config.behindImage) {
        // Ghost: face first, then scene image at 80% opacity on top
        // Draw face circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(faceImg, faceCX - faceR, faceCY - faceR, faceR * 2, faceR * 2);
        ctx.restore();
        // Draw scene on top semi-transparent
        ctx.globalAlpha = 0.82;
        ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
        ctx.globalAlpha = 1;
      } else {
        // Normal: scene first, face circle on top
        ctx.drawImage(bgImg, -offsetX, -offsetY, config.imgW * scale, config.imgH * scale);
        // Clip to circle and draw face
        ctx.save();
        ctx.beginPath();
        ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2);
        ctx.clip();
        // Draw face image centered on the circle
        const faceAspect = faceImg.naturalWidth / faceImg.naturalHeight;
        let fw = faceR * 2;
        let fh = faceR * 2;
        if (faceAspect > 1) { fh = fw / faceAspect; } else { fw = fh * faceAspect; }
        // Cover fill
        const fScale = Math.max((faceR * 2) / faceImg.naturalWidth, (faceR * 2) / faceImg.naturalHeight);
        const fdw = faceImg.naturalWidth * fScale;
        const fdh = faceImg.naturalHeight * fScale;
        ctx.drawImage(faceImg, faceCX - fdw / 2, faceCY - fdh / 2, fdw, fdh);
        ctx.restore();
        // Thin white ring around face
        ctx.beginPath();
        ctx.arc(faceCX, faceCY, faceR + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };

    bgImg.onload = () => { bgLoaded = true; tryDraw(); };
    faceImg.onload = () => { faceLoaded = true; tryDraw(); };
    bgImg.onerror = reject;
    faceImg.onerror = reject;

    bgImg.src = bgSrc;
    faceImg.src = faceSrc;
  });
}

// Single slide card
function SlideCard({
  question,
  senderUrl,
  receiverUrl,
  onNext,
  onPrev,
  onExit,
  index,
  total,
}: {
  question: typeof QUESTIONS[0];
  senderUrl: string | null;
  receiverUrl: string | null;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  index: number;
  total: number;
}) {
  const faceUrl = question.faceTarget === "receiver" ? receiverUrl : senderUrl;
  const [compositeSrc, setCompositeSrc] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!faceUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setCompositeSrc(null);

    const sceneName = question.image.replace("/images/", "").replace(".png", "");

    compositeOnCanvas(question.image, faceUrl, sceneName)
      .then(dataUrl => {
        setCompositeSrc(dataUrl);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [question.id, faceUrl]);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex flex-col items-center w-full max-w-sm mx-auto px-4"
    >
      {/* Progress */}
      <div className="w-full flex items-center gap-2 mb-5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= index ? "bg-primary" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-6"
      >
        {question.question}
      </motion.h2>

      {/* Composited image */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Reveal text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-white/80 text-base font-medium text-center mt-5 mb-6"
      >
        {question.revealText}
      </motion.p>

      {/* Navigation */}
      <div className="flex items-center gap-4 w-full">
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

      {/* Exit */}
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

  const handleNext = () => {
    if (currentIndex === QUESTIONS.length - 1) {
      setPhase("exit");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = (userData as any).token || userData.shareLink?.split("/share/")[1];
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

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden">

      {/* Cloud intro */}
      <AnimatePresence>
        {phase === "intro" && (
          <CloudIntro onReady={() => setPhase("slideshow")} />
        )}
      </AnimatePresence>

      {/* Slideshow */}
      <AnimatePresence mode="wait">
        {phase === "slideshow" && (
          <motion.div
            key="slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center min-h-screen py-10"
          >
            <AnimatePresence mode="wait">
              <SlideCard
                key={currentIndex}
                question={QUESTIONS[currentIndex]}
                senderUrl={senderUrl}
                receiverUrl={receiverUrl}
                onNext={handleNext}
                onPrev={handlePrev}
                onExit={() => setPhase("exit")}
                index={currentIndex}
                total={QUESTIONS.length}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit / message phase */}
      <AnimatePresence>
        {phase === "exit" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border/40 rounded-t-3xl p-6 shadow-2xl"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

            {messageSent ? (
              <div className="text-center space-y-4">
                <p className="text-primary font-semibold text-lg">
                  Message sent 🔒 Only they can see it
                </p>
                <Button
                  size="lg"
                  onClick={() => onNavigate("final")}
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
                  {userData.nickname || "them"}? Only they can see it 🔒
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate("final")}
                    className="flex-1 h-11 rounded-xl border-border/50"
                  >
                    Skip & Exit
                  </Button>
                  <Button
                    onClick={() => setShowMessage(true)}
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
                  Only {userData.nickname || "they"} can see this 💬
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
