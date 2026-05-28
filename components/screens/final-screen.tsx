"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Share2,
  MessageCircle,
  RefreshCw,
  Heart,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";
import ConfettiExplosion from "@/components/ui/confetti-explosion";

interface FinalScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

const memeEmojis = ["⏰", "🚀", "🪑", "🌍", "💊"];

export default function FinalScreen({ userData, onNavigate }: FinalScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <ParticleField />
      <ConfettiExplosion />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Trophy/Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow">
            <Trophy className="w-14 h-14 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            You Survived Emotional Objectification! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Your relationship has been officially meme-ified
          </p>
        </motion.div>

        {/* Meme collage recap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full glass rounded-2xl p-4 mb-6"
        >
          <p className="text-sm text-muted-foreground mb-3">
            You unlocked all the memes:
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {memeEmojis.map((emoji, i) => (
              <motion.div
                key={emoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                className="relative"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                  {emoji}
                </div>
                {userData.selfieUrl && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full overflow-hidden ring-2 ring-background">
                    <img
                      src={userData.selfieUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: "Memes Viewed", value: "5", icon: "👁️" },
            { label: "Emotional Damage", value: "∞", icon: "💔" },
            { label: "Chaos Level", value: "MAX", icon: "🔥" },
          ].map((stat, i) => (
            <div key={stat.label} className="glass rounded-xl p-3 text-center">
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <span className="text-xl font-bold text-primary">{stat.value}</span>
              <span className="text-xs text-muted-foreground block">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Send reaction to partner */}
        {userData.partnerSelfieUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full glass rounded-2xl p-4 mb-6"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Send a reaction to {userData.nickname || "your person"}:
            </p>
            <div className="flex justify-center gap-3">
              {["😂", "😭", "🥰", "💀", "🤯"].map((emoji) => (
                <button
                  key={emoji}
                  className="text-3xl hover:scale-125 transition-transform active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA - Create your own */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full space-y-3"
        >
          <Button
            size="lg"
            onClick={() => onNavigate("upload")}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Now It&apos;s Your Turn
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {}}
              className="flex-1 h-12 glass border-border/50 hover:bg-muted/50 rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share to Story
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              className="flex-1 h-12 glass border-border/50 hover:bg-muted/50 rounded-xl"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send
            </Button>
          </div>
        </motion.div>

        {/* Funny closing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground italic">
            &quot;No relationships were harmed in the making of these memes.
            <br />
            Probably.&quot;
          </p>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">LITERALLY ME</span>
          <Heart className="w-4 h-4 text-primary fill-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
}
