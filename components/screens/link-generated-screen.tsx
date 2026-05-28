"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Share2,
  QrCode,
  MessageCircle,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";
import ConfettiExplosion from "@/components/ui/confetti-explosion";

interface LinkGeneratedScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

export default function LinkGeneratedScreen({
  userData,
  onNavigate,
}: LinkGeneratedScreenProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userData.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform: string) => {
    const text = `Someone turned themselves into memes for you 👀 Check it out:`;
    const url = userData.shareLink;

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      instagram: url, // Instagram doesn't support direct sharing, so we just copy
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };

    if (platform === "instagram") {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/10 to-primary/10" />
      <ParticleField />
      <ConfettiExplosion />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Check className="w-12 h-12 text-primary-foreground" />
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Memes Are Ready! 🎉
          </h1>
          <p className="text-muted-foreground">
            Now send this to your partner and watch the chaos unfold
          </p>
        </motion.div>

        {/* Share card preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full glass rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            {userData.selfieUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/50 flex-shrink-0">
                <img
                  src={userData.selfieUrl}
                  alt="Your selfie"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {userData.nickname || "Someone"} made memes for you
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {userData.shareLink}
              </p>
            </div>
          </div>

          {/* Floating emojis */}
          <div className="flex justify-center gap-2 text-2xl">
            {["⏰", "🚀", "🪑", "🌍", "💊"].map((emoji, i) => (
              <motion.span
                key={emoji}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="animate-bounce-soft"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Copy link button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full mb-4"
        >
          <Button
            size="lg"
            onClick={handleCopy}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </motion.div>

        {/* Share buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full grid grid-cols-4 gap-3 mb-6"
        >
          {[
            { name: "WhatsApp", icon: MessageCircle, color: "bg-green-600", platform: "whatsapp" },
            { name: "Instagram", icon: Share2, color: "bg-gradient-to-br from-purple-600 to-pink-500", platform: "instagram" },
            { name: "Snapchat", icon: Send, color: "bg-yellow-400", platform: "snapchat" },
            { name: "QR", icon: QrCode, color: "bg-muted", platform: "qr" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => item.platform === "qr" ? setShowQR(!showQR) : handleShare(item.platform)}
              className={`${item.color} rounded-xl p-3 flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95`}
            >
              <item.icon className={`w-6 h-6 ${item.platform === "snapchat" ? "text-black" : "text-white"}`} />
              <span className={`text-xs ${item.platform === "snapchat" ? "text-black" : "text-white"}`}>
                {item.name}
              </span>
            </button>
          ))}
        </motion.div>

        {/* QR Code (placeholder) */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full glass rounded-2xl p-6 mb-6 flex flex-col items-center"
          >
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-2">
              <div className="w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-foreground/30" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Scan to open link</p>
          </motion.div>
        )}

        {/* Instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-4 w-full text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">
            📱 Send this link to your partner
          </p>
          <p className="text-xs text-muted-foreground/70">
            They&apos;ll need to upload a selfie to unlock your memes
          </p>
        </motion.div>

        {/* Demo button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate("partner-landing")}
            className="text-muted-foreground hover:text-foreground"
          >
            Preview what they&apos;ll see
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
