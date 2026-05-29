"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";

interface WaitingScreenProps {
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onNavigate: (screen: AppScreen) => void;
}

export default function WaitingScreen({
  userData,
  onUpdateUserData,
  onNavigate,
}: WaitingScreenProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    // Poll Supabase every 3 seconds
    const poll = setInterval(async () => {
      const { data } = await supabase
        .from("meme_sessions")
        .select("partner_selfie_url, private_message")
        .eq("token", userData.token)
        .single();

      if (data?.partner_selfie_url) {
        clearInterval(poll);
        onUpdateUserData({
          partnerSelfieUrl: data.partner_selfie_url,
          privateMessage: data.private_message || "",
        });
        onNavigate("final");
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [userData.token]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <ParticleField />

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-sm">
        {/* Animated selfie preview */}
        {userData.selfieUrl && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/50"
          >
            <img
              src={userData.selfieUrl}
              alt="Your selfie"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Waiting for {userData.nickname || "them"}{dots}
          </h1>
          <p className="text-muted-foreground">
            Share the link and wait for them to upload their selfie 👀
          </p>
        </div>

        {/* Pulsing indicator */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2 glass rounded-full px-4 py-2"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Checking for response every 3 seconds</span>
        </motion.div>

        {/* Share link again */}
        <button
          onClick={() => navigator.clipboard.writeText(userData.shareLink)}
          className="text-sm text-primary underline underline-offset-4"
        >
          Copy link again
        </button>
      </div>
    </motion.div>
  );
}
