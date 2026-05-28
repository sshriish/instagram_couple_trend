"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Share2, MessageCircle, RefreshCw, Heart, Trophy, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";
import ConfettiExplosion from "@/components/ui/confetti-explosion";
import { supabase } from "@/lib/supabase";

interface FinalScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

const memeEmojis = ["☕", "🪑", "🚀", "⏰", "🌍", "💊", "🧱", "🌊"];

export default function FinalScreen({ userData, onNavigate }: FinalScreenProps) {
  const [privateMessage, setPrivateMessage] = useState<string | null>(null);
  const [partnerSelfie, setPartnerSelfie] = useState<string | null>(userData.partnerSelfieUrl);
  const [checking, setChecking] = useState(false);

  // Poll Supabase every 5s to see if partner sent a message or selfie
  useEffect(() => {
    const token = (userData as any).shareLink?.split("/share/")[1];
    if (!token) return;

    const fetchUpdates = async () => {
      setChecking(true);
      const { data } = await supabase
        .from("meme_sessions")
        .select("private_message, partner_selfie_url")
        .eq("token", token)
        .single();
      if (data) {
        if (data.private_message) setPrivateMessage(data.private_message);
        if (data.partner_selfie_url) setPartnerSelfie(data.partner_selfie_url);
      }
      setChecking(false);
    };

    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5000);
    return () => clearInterval(interval);
  }, [userData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <ParticleField />
      <ConfettiExplosion />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Trophy */}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Link sent! Waiting for them… 👀
          </h1>
          <p className="text-lg text-muted-foreground">
            This page updates automatically when they respond
          </p>
          {checking && (
            <p className="text-xs text-muted-foreground mt-1 animate-pulse">checking for updates…</p>
          )}
        </motion.div>

        {/* Partner selfie — shown once they upload */}
        {partnerSelfie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 w-full glass rounded-2xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-3">
              They uploaded a selfie for you 📸
            </p>
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/50 mx-auto">
              <img src={partnerSelfie} alt="Partner selfie" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}

        {/* Private message — shown once they send it */}
        {privateMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass rounded-2xl p-5 mb-6 border border-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-bold text-base">Private message from them 🔒</span>
            </div>
            <p className="text-base text-foreground/90 italic leading-relaxed">
              &quot;{privateMessage}&quot;
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full glass rounded-2xl p-5 mb-6 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm text-muted-foreground">
                Waiting for their private message…
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              They'll see an option to leave you a private message after viewing the memes.
              It'll appear here automatically.
            </p>
          </motion.div>
        )}

        {/* Emoji recap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full glass rounded-2xl p-4 mb-6"
        >
          <p className="text-sm text-muted-foreground mb-3">Memes you sent:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {memeEmojis.map((emoji, i) => (
              <motion.div
                key={emoji}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.07, type: "spring" }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
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
            Create Another Link
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {}} className="flex-1 h-12 glass border-border/50 hover:bg-muted/50 rounded-xl">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={() => {}} className="flex-1 h-12 glass border-border/50 hover:bg-muted/50 rounded-xl">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send
            </Button>
          </div>
        </motion.div>

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
