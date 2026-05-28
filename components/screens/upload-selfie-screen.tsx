"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";

interface UploadSelfieScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onUpdateUserData: (data: Partial<UserData>) => void;
}

const loadingTexts = [
  "Turning your face into emotional damage...",
  "Generating relationship physics...",
  "Preparing your literal meanings...",
  "Converting feelings to objects...",
  "Applying meme transformation...",
  "Calibrating chaos levels...",
];

export default function UploadSelfieScreen({
  onNavigate,
  onUpdateUserData,
}: UploadSelfieScreenProps) {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleGenerate = async () => {
    if (!selfie) return;

    setIsProcessing(true);

    // Simulate processing with cycling loading texts
    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 4000));

    clearInterval(textInterval);

    // Generate a fake share link
    const shareLink = `https://literallyme.app/m/${Math.random().toString(36).substring(2, 10)}`;

    onUpdateUserData({
      selfieUrl: selfie,
      nickname: nickname || "babe",
      shareLink,
    });

    setIsProcessing(false);
    onNavigate("link-generated");
  };

  const removeSelfie = () => {
    setSelfie(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <ParticleField />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => onNavigate("landing")}
        className="absolute top-6 left-6 z-20 glass rounded-full p-2 hover:bg-muted/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
            Upload Your Selfie
          </h1>
          <p className="text-muted-foreground text-pretty">
            This is the face that will haunt your partner
          </p>
        </motion.div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
            id="selfie-upload"
          />

          <AnimatePresence mode="wait">
            {!selfie ? (
              <motion.label
                key="upload-area"
                htmlFor="selfie-upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative flex flex-col items-center justify-center
                  w-64 h-64 mx-auto rounded-full cursor-pointer
                  glass border-2 border-dashed transition-all duration-300
                  ${isDragging 
                    ? "border-primary bg-primary/10 scale-105" 
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground text-center px-4">
                    Tap to take a selfie
                    <br />
                    <span className="text-xs">or drag & drop</span>
                  </span>
                </div>
              </motion.label>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-64 h-64 mx-auto"
              >
                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/50 animate-pulse-glow">
                  <img
                    src={selfie}
                    alt="Your selfie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removeSelfie}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Nickname input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs mb-6"
        >
          <label className="text-sm text-muted-foreground mb-2 block text-center">
            What does your partner call you? (optional)
          </label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g., babe, honey, chaos goblin"
            className="text-center glass border-border/50 h-12 rounded-xl"
          />
        </motion.div>

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs"
        >
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!selfie || isProcessing}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="text-sm">{loadingTexts[loadingTextIndex]}</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Generate Meme Link
              </>
            )}
          </Button>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground text-center mt-6 max-w-xs"
        >
          Your photo is processed locally and only shared with your partner through the link you create.
        </motion.p>
      </div>
    </motion.div>
  );
}
