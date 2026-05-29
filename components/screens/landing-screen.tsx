"use client";

import { motion } from "framer-motion";
import { Sparkles, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen } from "@/app/page";
import FloatingMemes from "@/components/ui/floating-memes";
import ParticleField from "@/components/ui/particle-field";

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <ParticleField />
      <FloatingMemes />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              The Viral Couple Meme Trend
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-balance"
        >
          <span className="text-foreground">The Most Unhinged Thing</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient neon-text">
            You'll Do For   LOVE 
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md text-pretty"
        >
          A personalized meme trap. Built for your partner. Powered by your face.
        </motion.p>

        {/* Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {[
            { emoji: "🌍", phrase: "worldwide trend" },
            { emoji: "🔞", phrase: "too real for some couples" },
            { emoji: "📩", phrase: "one link, one reaction" },
          ].map((item, i) => (
            <motion.div
              key={item.phrase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5"
            >
              <span>{item.emoji}</span>
              <span className="text-foreground/70">{item.phrase}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <Button
            size="lg"
            onClick={() => onNavigate("upload")}
            className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 animate-pulse-glow rounded-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Your Link
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate("partner-landing")}
            className="flex-1 h-14 text-lg font-semibold glass border-border/50 hover:bg-muted/50 rounded-xl"
          >
            <Play className="w-5 h-5 mr-2" />
            See Demo
          </Button>
        </motion.div>

        {/* Footer trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"
        >
          <span><span className="text-primary">✓</span> Free forever</span>
          <span><span className="text-primary">✓</span> No signup</span>
          <span><span className="text-primary">✓</span> 100% chaos</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="mt-8"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </motion.div>
  );
}
