"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppScreen, UserData } from "@/app/page";
import { supabase } from "@/lib/supabase";

interface MemeRevealScreenProps {
  userData: UserData;
  onNavigate: (screen: AppScreen) => void;
}

interface Question {
  id: number;
  question: string;
  subtext: string;
  scene: "couch" | "space" | "clock" | "world" | "pill";
  emoji: string;
  unlocked: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "You want a break?",
    subtext: "Take a breather... literally 😮‍💨",
    scene: "couch",
    emoji: "🛋️",
    unlocked: false,
  },
  {
    id: 2,
    question: "You can't stand me?",
    subtext: "Fine. Become furniture then 🪑",
    scene: "couch",
    emoji: "🪑",
    unlocked: false,
  },
  {
    id: 3,
    question: "You need space?",
    subtext: "Way ahead of you, astronaut 🚀",
    scene: "space",
    emoji: "🚀",
    unlocked: false,
  },
  {
    id: 4,
    question: "You need time?",
    subtext: "Okay, you ARE time now ⏰",
    scene: "clock",
    emoji: "⏰",
    unlocked: false,
  },
  {
    id: 5,
    question: "You are my world?",
    subtext: "Literally. The whole planet 🌍",
    scene: "world",
    emoji: "🌍",
    unlocked: false,
  },
];

function drawCouchScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  ctx.fillStyle = "#c8a882";
  ctx.fillRect(0, 0, W, W);
  const couch = (x: number, y: number, w: number, h: number, col: string, r = 12) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    ctx.fill();
  };
  couch(W * 0.05, W * 0.52, W * 0.9, W * 0.38, "#8B5E3C");
  couch(W * 0.05, W * 0.42, W * 0.9, W * 0.18, "#9C6B45");
  couch(W * 0.05, W * 0.44, W * 0.16, W * 0.44, "#7A4F2D");
  couch(W * 0.79, W * 0.44, W * 0.16, W * 0.44, "#7A4F2D");
  couch(W * 0.05, W * 0.38, W * 0.18, W * 0.14, "#9C6B45");
  couch(W * 0.77, W * 0.38, W * 0.18, W * 0.14, "#9C6B45");
  ctx.fillStyle = "#6b4226";
  ctx.fillRect(W * 0.1, W * 0.86, W * 0.07, W * 0.06);
  ctx.fillRect(W * 0.83, W * 0.86, W * 0.07, W * 0.06);
  const cx = W / 2, cy = W * 0.32, r = W * 0.18;
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#aaa";
    ctx.font = `${W * 0.14}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("😐", cx, cy);
  }
}

function drawSpaceScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  const grd = ctx.createRadialGradient(W / 2, W / 2, 10, W / 2, W / 2, W * 0.7);
  grd.addColorStop(0, "#1a1a4e");
  grd.addColorStop(1, "#070714");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, W);
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8 + 0.1})`;
    const s = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * W, s, 0, Math.PI * 2);
    ctx.fill();
  }
  const hx = W * 0.5, hy = W * 0.38, hr = W * 0.22;
  // Helmet outer shell
  ctx.fillStyle = "#d0d0d0";
  ctx.beginPath();
  ctx.arc(hx, hy, hr, 0, Math.PI * 2);
  ctx.fill();
  // Helmet collar rings
  ctx.strokeStyle = "#b0b0b0";
  ctx.lineWidth = W * 0.04;
  ctx.beginPath();
  ctx.arc(hx, hy, hr * 1.15, -Math.PI * 0.7, -Math.PI * 0.05);
  ctx.stroke();
  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = W * 0.035;
  ctx.beginPath();
  ctx.arc(hx, hy, hr * 1.2, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  // Visor tinted glass
  const vr = hr * 0.72;
  ctx.fillStyle = "rgba(135,206,235,0.25)";
  ctx.beginPath();
  ctx.arc(hx, hy, vr, 0, Math.PI * 2);
  ctx.fill();
  // Face inside visor
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(hx, hy, vr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, hx - vr, hy - vr, vr * 2, vr * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(135,206,235,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hx, hy, vr, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Visor shine
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.arc(hx - vr * 0.25, hy - vr * 0.25, vr * 0.35, 0, Math.PI * 2);
  ctx.fill();
  // Flag patch on suit
  ctx.fillStyle = "#e63946";
  ctx.fillRect(hx + hr * 0.9, hy - W * 0.02, W * 0.04, W * 0.15);
  ctx.beginPath();
  ctx.moveTo(hx + hr * 0.9 + W * 0.04, hy - W * 0.02);
  ctx.lineTo(hx + hr * 0.9 + W * 0.1, hy + W * 0.055);
  ctx.lineTo(hx + hr * 0.9 + W * 0.04, hy + W * 0.13);
  ctx.fill();
}

function drawClockScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  ctx.fillStyle = "#e8e0d0";
  ctx.fillRect(0, 0, W, W);
  const cx = W / 2, cy = W * 0.45, r = W * 0.3;
  ctx.fillStyle = "#d4c9b0";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fafaf5";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8B7355";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8));
    ctx.lineTo(cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2));
    ctx.stroke();
  }
  ctx.strokeStyle = "#2c2c2c";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.5);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.35, cy + r * 0.1);
  ctx.stroke();
  ctx.fillStyle = "#2c2c2c";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8B7355";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - r - 8, cy - r * 0.4);
  ctx.lineTo(cx - r - 8, cy - r * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r + 8, cy - r * 0.4);
  ctx.lineTo(cx + r + 8, cy - r * 0.15);
  ctx.stroke();
  const fr = r * 0.32;
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, fr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, cx - fr, cy - fr, fr * 2, fr * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(139,115,85,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, fr, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawWorldScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  const grd = ctx.createRadialGradient(W / 2, W / 2, W * 0.1, W / 2, W / 2, W * 0.6);
  grd.addColorStop(0, "#1a3a5c");
  grd.addColorStop(1, "#0d1f35");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, W);
  const ex = W / 2, ey = W * 0.45, er = W * 0.3;
  ctx.fillStyle = "#1565C0";
  ctx.beginPath();
  ctx.arc(ex, ey, er, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2E7D32";
  ctx.beginPath();
  ctx.ellipse(ex - er * 0.15, ey - er * 0.15, er * 0.25, er * 0.35, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ex + er * 0.2, ey + er * 0.1, er * 0.2, er * 0.28, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ex, ey, er + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(79,195,247,0.3)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(ex, ey, er + 14, 0, Math.PI * 2);
  ctx.stroke();
  const fr = er * 0.28;
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, fr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, ex - fr, ey - fr, fr * 2, fr * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ex, ey, fr, 0, Math.PI * 2);
    ctx.stroke();
  }
}

const SCENE_DRAW: Record
  string,
  (ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) => void
> = {
  couch: drawCouchScene,
  space: drawSpaceScene,
  clock: drawClockScene,
  world: drawWorldScene,
  pill: drawCouchScene,
};

export default function MemeRevealScreen({ userData, onNavigate }: MemeRevealScreenProps) {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [faceImg, setFaceImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const allUnlocked = questions.every((q) => q.unlocked);

  useEffect(() => {
    if (userData.selfieUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setFaceImg(img);
      img.src = userData.selfieUrl;
    }
  }, [userData.selfieUrl]);

  useEffect(() => {
    if (activeQuestion && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) SCENE_DRAW[activeQuestion.scene](ctx, 400, faceImg);
    }
  }, [activeQuestion, faceImg]);

  const handleQuestionTap = (q: Question) => {
    setActiveQuestion(q);
    setQuestions((prev) =>
      prev.map((item) => (item.id === q.id ? { ...item, unlocked: true } : item))
    );
  };

  const handleClose = () => setActiveQuestion(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = userData.shareLink?.split("/share/")[1];
      if (token) {
        await supabase
          .from("meme_sessions")
          .update({ private_message: message })
          .eq("token", token);
      }
    } catch (e) {
      console.error(e);
    }
    setMessageSent(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-background to-secondary/10 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/30 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">from {userData.nickname || "your person"}</p>
          <h1 className="text-lg font-bold leading-tight">Answer honestly… 👀</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          {questions.filter((q) => q.unlocked).length}/{questions.length} revealed
        </div>
      </div>

      {/* Questions list */}
      <div className="px-4 py-4 space-y-3 pb-32">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleQuestionTap(q)}
            className={`
              relative cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden
              ${q.unlocked
                ? "border-primary/40 bg-primary/5"
                : "border-border/50 bg-card hover:border-primary/30 hover:bg-muted/30"}
            `}
          >
            <div className="flex items-center gap-4 p-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${q.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                {q.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base leading-tight">{q.question}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{q.subtext}</p>
              </div>
              <div className="flex-shrink-0">
                {q.unlocked ? (
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">Seen ✓</span>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                  >
                    Tap 👇
                  </motion.div>
                )}
              </div>
            </div>
            {q.unlocked && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary" />
            )}
          </motion.div>
        ))}
      </div>

      {/* All unlocked — Exit + Message bar */}
      <AnimatePresence>
        {allUnlocked && !showMessage && !messageSent && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/30 space-y-3"
          >
            <p className="text-center text-sm text-muted-foreground">You've seen it all 👀</p>
            <Button
              size="lg"
              onClick={() => setShowMessage(true)}
              className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary rounded-xl"
            >
              <Lock className="w-4 h-4 mr-2" />
              Leave a private message
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onNavigate("final")}
              className="w-full h-10 text-muted-foreground"
            >
              Exit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Private message sheet */}
      <AnimatePresence>
        {showMessage && !messageSent && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border/40 rounded-t-3xl p-6 shadow-2xl"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-lg">Private message</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Only {userData.nickname || "they"} can see this. Say anything 💬
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type something honest... or chaotic 🔥"
              rows={4}
              className="w-full rounded-xl border border-border/60 bg-muted/40 p-3 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors"
            />
            <div className="flex gap-3 mt-3">
              <Button variant="outline" onClick={() => setShowMessage(false)} className="flex-1 h-11 rounded-xl border-border/50">
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message sent */}
      <AnimatePresence>
        {messageSent && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/30 space-y-3"
          >
            <p className="text-center text-sm text-primary font-medium">
              Message sent 🔒 Only they can see it
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate("final")}
              className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary rounded-xl"
            >
              Exit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meme reveal modal */}
      <AnimatePresence>
        {activeQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center px-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: 8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-4"
              >
                <p className="text-white/60 text-sm mb-1">When you say...</p>
                <h2 className="text-white text-2xl font-bold">{activeQuestion.question}</h2>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
              >
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ aspectRatio: "1", display: "block" }}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4 space-y-3"
              >
                <p className="text-white/70 text-base">{activeQuestion.subtext}</p>
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 mx-auto text-white/50 hover:text-white transition-colors text-sm"
                >
                  <ChevronDown className="w-4 h-4" />
                  Back to questions
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
