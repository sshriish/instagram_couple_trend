"use client";

import { motion } from "framer-motion";
import { Lock, Upload, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";

interface PartnerLandingScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

export default function PartnerLandingScreen({
  userData,
  onNavigate,
}: PartnerLandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10" />
      <ParticleField />

      {/* Blurred preview background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-xl">
        <div className="grid grid-cols-2 gap-4 p-8">
          {["⏰", "🚀", "🪑", "🌍"].map((emoji, i) => (
            <div
              key={i}
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Animated lock icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-2 rounded-full border-2 border-primary/30"
            />
          </div>
        </motion.div>

        {/* Sender info */}
        {userData.selfieUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/50 mx-auto mb-2">
              <img
                src={userData.selfieUrl}
                alt="Sender"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Someone turned themselves into memes for you
          </h1>
          <p className="text-lg text-muted-foreground">
            <span className="text-primary font-semibold">
              {userData.nickname || "Your person"}
            </span>{" "}
            created something chaotic
          </p>
        </motion.div>

        {/* Preview hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {[
            "I need time ⏰",
            "I need space 🚀",
            "I can't stand you 🪑",
            "You are my world 🌍",
          ].map((hint, i) => (
            <motion.div
              key={hint}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-full px-3 py-1.5 text-sm text-muted-foreground blur-[2px] hover:blur-0 transition-all duration-300"
            >
              {hint}
            </motion.div>
          ))}
        </motion.div>

        {/* Lock message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-6 w-full mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-primary" />
            <span className="font-semibold">Unlock Required</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a selfie to reveal what they created for you. Your photo will
            be sent privately to them.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("partner-upload")}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload a Selfie to Continue
          </Button>
        </motion.div>

        {/* Suspense builder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span>5 personalized memes waiting to be revealed</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
