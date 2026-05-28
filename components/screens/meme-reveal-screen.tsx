"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";

interface MemeRevealScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

interface MemeSlide {
  id: number;
  phrase: string;
  emoji: string;
  description: string;
  bgGradient: string;
  revealDelay: number;
}

const memeSlides: MemeSlide[] = [
  {
    id: 1,
    phrase: '"I need time"',
    emoji: "⏰",
    description: "When bae is literally a clock",
    bgGradient: "from-amber-900/50 via-background to-orange-900/30",
    revealDelay: 1500,
  },
  {
    id: 2,
    phrase: '"I need space"',
    emoji: "🚀",
    description: "Houston, we have a relationship",
    bgGradient: "from-indigo-900/50 via-background to-purple-900/30",
    revealDelay: 1500,
  },
  {
    id: 3,
    phrase: '"I can\'t stand you"',
    emoji: "🪑",
    description: "Plot twist: they're now furniture",
    bgGradient: "from-emerald-900/50 via-background to-teal-900/30",
    revealDelay: 1500,
  },
  {
    id: 4,
    phrase: '"You are my world"',
    emoji: "🌍",
    description: "Global warming? More like global charming",
    bgGradient: "from-blue-900/50 via-background to-cyan-900/30",
    revealDelay: 1500,
  },
  {
    id: 5,
    phrase: '"I need healing"',
    emoji: "💊",
    description: "The prescription is... more memes",
    bgGradient: "from-rose-900/50 via-background to-pink-900/30",
    revealDelay: 1500,
  },
];

export default function MemeRevealScreen({
  userData,
  onNavigate,
}: MemeRevealScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentMeme = memeSlides[currentSlide];

  // Auto-reveal after delay
  useEffect(() => {
    setShowReveal(false);
    const timer = setTimeout(() => {
      setShowReveal(true);
    }, currentMeme.revealDelay);
    return () => clearTimeout(timer);
  }, [currentSlide, currentMeme.revealDelay]);

  const goToNext = useCallback(() => {
    if (currentSlide < memeSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onNavigate("final");
    }
  }, [currentSlide, onNavigate]);

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const toggleLike = () => {
    if (liked.includes(currentMeme.id)) {
      setLiked(liked.filter((id) => id !== currentMeme.id));
    } else {
      setLiked([...liked, currentMeme.id]);
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic background */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-br ${currentMeme.bgGradient}`}
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2 safe-top">
        {memeSlides.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 rounded-full bg-foreground/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: "0%" }}
              animate={{
                width:
                  index < currentSlide
                    ? "100%"
                    : index === currentSlide
                      ? "100%"
                      : "0%",
              }}
              transition={{
                duration: index === currentSlide ? 3 : 0,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* Top controls */}
      <div className="absolute top-10 right-4 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="glass rounded-full p-2"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            {/* Phrase */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-sm text-muted-foreground mb-2">
                When they say...
              </p>
              <h1 className="text-4xl md:text-5xl font-bold neon-text text-balance">
                {currentMeme.phrase}
              </h1>
            </motion.div>

            {/* Meme reveal area */}
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Suspense state */}
              <AnimatePresence>
                {!showReveal && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 glass rounded-3xl flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-8xl"
                    >
                      ?
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Revealed meme */}
              <AnimatePresence>
                {showReveal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full glass rounded-3xl overflow-hidden flex items-center justify-center">
                      {/* Emoji background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[180px] opacity-30">
                          {currentMeme.emoji}
                        </span>
                      </div>

                      {/* Face merged visualization */}
                      <div className="relative z-10 flex flex-col items-center">
                        {userData.selfieUrl ? (
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/50">
                              <img
                                src={userData.selfieUrl}
                                alt="Meme face"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                              className="absolute -bottom-4 -right-4 text-6xl"
                            >
                              {currentMeme.emoji}
                            </motion.span>
                          </div>
                        ) : (
                          <span className="text-9xl">{currentMeme.emoji}</span>
                        )}
                      </div>

                      {/* Glow effect */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showReveal ? 1 : 0, y: showReveal ? 0 : 20 }}
              transition={{ delay: 0.3 }}
              className="text-center text-muted-foreground mt-6 text-lg"
            >
              {currentMeme.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 safe-bottom">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              className={`glass rounded-full p-3 transition-all duration-300 ${
                liked.includes(currentMeme.id)
                  ? "bg-red-500/20 text-red-500"
                  : ""
              }`}
            >
              <Heart
                className={`w-6 h-6 ${liked.includes(currentMeme.id) ? "fill-current" : ""}`}
              />
            </button>
            <button className="glass rounded-full p-3">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="glass rounded-full p-3">
              <Download className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              disabled={currentSlide === 0}
              className="glass rounded-full disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentSlide + 1}/{memeSlides.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="glass rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Replay */}
          <button
            onClick={() => {
              setShowReveal(false);
              setTimeout(() => setShowReveal(true), currentMeme.revealDelay);
            }}
            className="glass rounded-full p-3"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Swipe hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-muted-foreground mt-3"
        >
          Swipe or tap arrows to continue
        </motion.p>
      </div>

      {/* Side tap areas for navigation */}
      <div
        onClick={goToPrev}
        className="absolute left-0 top-20 bottom-20 w-16 z-20 cursor-pointer"
      />
      <div
        onClick={goToNext}
        className="absolute right-0 top-20 bottom-20 w-16 z-20 cursor-pointer"
      />
    </motion.div>
  );
}
