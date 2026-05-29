"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppScreen, UserData } from "@/app/page";
import ParticleField from "@/components/ui/particle-field";
import { supabase } from "@/lib/supabase";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"choose" | "camera" | "preview">("choose");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
        setMode("preview");
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
      alert("Could not access camera. Please allow camera permission or upload from gallery.");
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

    // Convert dataUrl to File for upload
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
      }
    }, "image/jpeg");

    setSelfie(dataUrl);
    stopWebcam();
    setMode("preview");
  };

  const removeSelfie = () => {
    setSelfie(null);
    setSelectedFile(null);
    setErrorMsg(null);
    setMode("choose");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1200);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.");
      }

      const token = crypto.randomUUID();
      const filePath = `partner-a/${token}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("selfies")
        .upload(filePath, selectedFile);

      if (uploadError) throw new Error("Storage upload failed: " + uploadError.message);

      const { data: urlData } = supabase.storage
        .from("selfies")
        .getPublicUrl(filePath);

      const selfieUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from("meme_sessions")
        .insert({ token, nickname: nickname || "babe", selfie_url: selfieUrl });

      if (dbError) throw new Error("Database insert failed: " + dbError.message);

      const shareLink = `${window.location.origin}/share/${token}`;

      clearInterval(textInterval);
      onUpdateUserData({ selfieUrl, nickname: nickname || "babe", shareLink, token });
      setIsProcessing(false);
      onNavigate("waiting");
    } catch (err: any) {
      console.error(err);
      clearInterval(textInterval);
      setIsProcessing(false);
      setErrorMsg(err?.message || "Something went wrong. Try again.");
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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" />
      <ParticleField />
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="selfie-upload"
      />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => { stopWebcam(); onNavigate("landing"); }}
        className="absolute top-6 left-6 z-20 glass rounded-full p-2 hover:bg-muted/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary mb-6"
            />
            <motion.p
              key={loadingTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-center max-w-xs"
            >
              {loadingTexts[loadingTextIndex]}
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
            Your Selfie, Your Memes ✨
          </h1>
          <p className="text-muted-foreground text-pretty">
            Take a photo or upload from gallery
          </p>
        </motion.div>

        {/* CHOOSE mode */}
        {mode === "choose" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 w-full"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Camera button */}
            <button
              onClick={startWebcam}
              className={`relative flex flex-col items-center justify-center w-56 h-56 mx-auto rounded-full cursor-pointer glass border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground text-center px-4">
                  Take a selfie
                </span>
              </div>
            </button>

            {/* Gallery option */}
            <label
              htmlFor="selfie-upload"
              className="flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors"
            >
              <Upload className="w-4 h-4" />
              or upload from gallery
            </label>

            {isDragging && (
              <p className="text-sm text-primary animate-pulse">Drop it here!</p>
            )}
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
                <span className="text-xs text-foreground">Looking good!</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Nickname input — show in preview mode */}
        {mode === "preview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xs mt-10"
          >
            <Input
              placeholder="Your nickname (optional)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-12 glass border-border/50 rounded-xl text-center"
            />
          </motion.div>
        )}

        {/* Error */}
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm mt-4 text-center max-w-xs"
          >
            {errorMsg}
          </motion.p>
        )}

        {/* Generate button */}
        {mode === "preview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xs mt-4"
          >
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!selectedFile || isProcessing}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 rounded-xl disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate My Memes
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
