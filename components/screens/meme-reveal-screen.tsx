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
// shape: "circle" | "ellipse" — clipping shape
// blendMode: CSS mix-blend-mode value
// opacity: overlay opacity (0–1)
// filter: CSS filter string applied to face image
// top/left/width/height: positioning as % of the card container
const QUESTIONS = [
  {
    id: 1,
    question: "You can't stand me?",
    revealText: "Okay.... there you go sit on me 🫦",
    emoji: "🪑",
    image: "/images/sofa.png",
    faceTarget: "sender",
    // Face goes on the left cushion of the sofa
    faceConfig: {
      top: "28%", left: "22%", width: "36%", height: "36%",
      shape: "ellipse",
      blendMode: "multiply",
      opacity: 0.82,
      filter: "contrast(1.05) saturate(0.7) brightness(0.9)",
    },
  },
  {
    id: 2,
    question: "You need space?",
    revealText: "Think again",
    emoji: "🚀",
    image: "/images/astronaut.png",
    faceTarget: "sender",
    // Face fits inside the helmet visor (oval, centered on helmet)
    faceConfig: {
      top: "14%", left: "46%", width: "30%", height: "32%",
      shape: "ellipse",
      blendMode: "screen",
      opacity: 0.88,
      filter: "contrast(1.1) saturate(0.85) brightness(1.05)",
    },
  },
  {
    id: 3,
    question: "You need time?",
    revealText: "Take your time.",
    emoji: "⏰",
    image: "/images/clock.png",
    faceTarget: "sender",
    // Face fills the clock dial circle
    faceConfig: {
      top: "8%", left: "22%", width: "56%", height: "56%",
      shape: "circle",
      blendMode: "luminosity",
      opacity: 0.72,
      filter: "contrast(1.1) saturate(0.6) brightness(1.0)",
    },
  },
  {
    id: 4,
    question: "You are my world?",
    revealText: "you're literally my Everything!!",
    emoji: "🌍",
    image: "/images/earth.png",
    faceTarget: "receiver",
    // Face softly overlaid across the whole earth sphere
    faceConfig: {
      top: "5%", left: "10%", width: "80%", height: "80%",
      shape: "circle",
      blendMode: "soft-light",
      opacity: 0.60,
      filter: "contrast(0.9) saturate(0.5) brightness(1.1)",
    },
  },
  {
    id: 5,
    question: "You need to heal?",
    revealText: "Take your time princess and I am sorry",
    emoji: "🩹",
    image: "/images/bandaid.png",
    faceTarget: "sender",
    // Face on the center gauze pad of the bandaid (rotated ~-40deg bandaid)
    faceConfig: {
      top: "30%", left: "30%", width: "38%", height: "38%",
      shape: "circle",
      blendMode: "multiply",
      opacity: 0.80,
      filter: "contrast(1.05) saturate(0.75) brightness(0.95)",
    },
  },
  {
    id: 6,
    question: "You want distance?",
    revealText: "Measured. Confirmed. Noted 📏",
    emoji: "📏",
    image: "/images/ruler.png",
    faceTarget: "sender",
    // Face blended on the ruler surface, center-left
    faceConfig: {
      top: "28%", left: "20%", width: "34%", height: "34%",
      shape: "circle",
      blendMode: "multiply",
      opacity: 0.75,
      filter: "contrast(1.0) saturate(0.5) brightness(0.9)",
    },
  },
  {
    id: 7,
    question: "You need a break?",
    revealText: "pch fine :(",
    emoji: "🍫",
    image: "/images/kitkat.png",
    faceTarget: "sender",
    // Face on the KitKat bar wrapper center
    faceConfig: {
      top: "20%", left: "32%", width: "36%", height: "36%",
      shape: "circle",
      blendMode: "multiply",
      opacity: 0.78,
      filter: "contrast(1.05) saturate(0.65) brightness(0.85)",
    },
  },
  {
    id: 8,
    question: "I drive you crazy?",
    revealText: "congrats you won, you saw something no-one ever did",
    emoji: "🚗",
    image: "/images/steering.png",
    faceTarget: "sender",
    // Face inside the center hub/logo area of the steering wheel
    faceConfig: {
      top: "26%", left: "28%", width: "44%", height: "44%",
      shape: "circle",
      blendMode: "luminosity",
      opacity: 0.80,
      filter: "contrast(1.05) saturate(0.7) brightness(1.0)",
    },
  },
  {
    id: 9,
    question: "You're my sunshine?",
    revealText: "You literally light up my world",
    emoji: "☀️",
    image: "/images/sun.png",
    faceTarget: "receiver",
    // Face inside the circular sun disc at center
    faceConfig: {
      top: "22%", left: "28%", width: "44%", height: "44%",
      shape: "circle",
      blendMode: "soft-light",
      opacity: 0.85,
      filter: "contrast(1.0) saturate(0.7) brightness(1.1)",
    },
  },
  {
    id: 10,
    question: "You want to ghost me?",
    revealText: "Fine ghost me but from today onwards even death can't do us apart",
    emoji: "👻",
    image: "/images/ghost.png",
    faceTarget: "sender",
    // Face where the ghost "head" is (upper body of the ghost)
    faceConfig: {
      top: "10%", left: "28%", width: "44%", height: "44%",
      shape: "circle",
      blendMode: "luminosity",
      opacity: 0.70,
      filter: "contrast(1.0) saturate(0.0) brightness(1.15)",
    },
  },
];

// Cloud splitting intro
function CloudIntro({ onReady }: { onReady: () => void }) {
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
  const faceUrl =
    question.faceTarget === "receiver" ? receiverUrl : senderUrl;

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

      {/* Image with face blend */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10"
        style={{ aspectRatio: "1" }}
      >
        {/* Base image */}
        <img
          src={question.image}
          alt={question.question}
          className="w-full h-full object-cover"
        />

        {/* Face blended on top — per-slide precise config */}
        {faceUrl && (
          <div
            className="absolute overflow-hidden"
            style={{
              top: question.faceConfig.top,
              left: question.faceConfig.left,
              width: question.faceConfig.width,
              height: question.faceConfig.height,
              borderRadius: question.faceConfig.shape === "circle" ? "50%" : "50% / 45%",
              mixBlendMode: question.faceConfig.blendMode as any,
              opacity: question.faceConfig.opacity,
            }}
          >
            <img
              src={faceUrl}
              alt="face"
              className="w-full h-full object-cover"
              style={{ filter: question.faceConfig.filter }}
            />
          </div>
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
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
