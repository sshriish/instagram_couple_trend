"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ArrowLeft, Unlock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

interface PartnerUploadScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onUpdateUserData: (data: Partial<UserData>) => void;
}

export default function PartnerUploadScreen({
  onNavigate,
  onUpdateUserData,
}: PartnerUploadScreenProps) {
  const { token } = useParams() as { token: string };
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [mode, setMode] = useState<"choose" | "camera" | "preview">("choose");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setMode("camera");
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert("Could not access camera. Please allow camera permission and try again.");
    }
  };

  const stopWebcam = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setMode("choose");
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setSelfie(dataUrl);
    stopWebcam();
    setMode("preview");
  };

  const removeSelfie = () => {
    setSelfie(null);
    setMode("choose");
  };

  const handleUnlock = async () => {
    if (!selfie) return;
    setIsUnlocking(true);

    try {
      const res = await fetch(selfie);
      const blob = await res.blob();
      const fileName = `partner-${token}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("selfies")
        .upload(fileName, blob, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("selfies")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      await supabase
        .from("meme_sessions")
        .update({ partner_selfie_url: publicUrl })
        .eq("token", token);

      onUpdateUserData({ partnerSelfieUrl: publicUrl });
    } catch (err) {
      console.error("Upload failed:", err);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    onNavigate("meme-reveal");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <ParticleField />
      <canvas ref={canvasRef} className="hidden" />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => { stopWebcam(); onNavigate("partner-landing"); }}
        className="absolute top-6 left-6 z-20 glass rounded-full p-2 hover:bg-muted/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Unlocking overlay */}
      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Unlock className="w-16 h-16 text-primary-foreground" />
              </div>
              <motion.div
                animate={{ scale: [1, 2, 3], opacity: [0.5, 0.3, 0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl font-semibold"
            >
              Unlocking the chaos...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
            Almost There!
          </h1>
          <p className="text-muted-foreground text-pretty">
            Take a live selfie to unlock the memes 📸
          </p>
        </motion.div>

        {/* CHOOSE mode */}
        {mode === "choose" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <button
              onClick={startWebcam}
              className="relative flex flex-col items-center justify-center w-56 h-56 mx-auto rounded-full cursor-pointer glass border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground text-center px-4">
                  Tap to take a live selfie
                </span>
              </div>
            </button>
          </motion.div>
        )}

        {/* CAMERA mode */}
        {mode === "camera" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="relative w-64 h-64 rounded-full overflow-hidden ring-4 ring-primary/50 mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={capturePhoto}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                Snap!
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={stopWebcam}
                className="h-14 px-4 glass border-border/50 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PREVIEW mode */}
        {mode === "preview" && selfie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            <div className="relative w-56 h-56 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/50"
              />
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/50">
                <img src={selfie} alt="Your selfie" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={removeSelfie}
                className="absolute -top-2 -right-2 w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1 flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-foreground">Face detected</span>
              </motion.div>
            </div>

            <Button
              size="lg"
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full max-w-xs h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl disabled:opacity-50 mt-4"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Unlock the Memes
            </Button>
          </motion.div>
        )}

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-start gap-2 text-xs text-muted-foreground max-w-xs"
        >
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <p>
            Your live selfie will only be sent privately to the person who
            created this link. It won&apos;t be used in any memes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
