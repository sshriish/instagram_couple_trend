"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Lock, ChevronDown, LogOut } from "lucide-react";
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
    subtext: "Fine. Become a sofa then 🛋️",
    scene: "couch",
    emoji: "☕",
    unlocked: false,
  },
  {
    id: 2,
    question: "You can't stand me?",
    subtext: "Okay... you ARE the chair now 🪑",
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

// Scene 1: "You want a break?" → guy IS the sofa/couch
function drawBreakScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  // Warm living room background
  ctx.fillStyle = "#f5ede0";
  ctx.fillRect(0, 0, W, W);
  // Floor
  ctx.fillStyle = "#d4a96a";
  ctx.fillRect(0, W * 0.78, W, W * 0.22);
  // Baseboard
  ctx.fillStyle = "#c49a5a";
  ctx.fillRect(0, W * 0.78, W, W * 0.03);

  // Draw a big couch shape where the face is embedded
  const couch = (x: number, y: number, w: number, h: number, col: string, r = 14) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    ctx.fill();
  };

  // Couch body
  couch(W * 0.04, W * 0.5, W * 0.92, W * 0.32, "#8B5E3C");
  // Seat cushion top
  couch(W * 0.04, W * 0.42, W * 0.92, W * 0.14, "#9C6B45");
  // Left armrest
  couch(W * 0.04, W * 0.4, W * 0.15, W * 0.42, "#7A4F2D");
  // Right armrest
  couch(W * 0.81, W * 0.4, W * 0.15, W * 0.42, "#7A4F2D");
  // Left top armrest
  couch(W * 0.02, W * 0.36, W * 0.19, W * 0.1, "#9C6B45");
  // Right top armrest
  couch(W * 0.79, W * 0.36, W * 0.19, W * 0.1, "#9C6B45");
  // Couch legs
  ctx.fillStyle = "#6b4226";
  ctx.fillRect(W * 0.09, W * 0.79, W * 0.06, W * 0.04);
  ctx.fillRect(W * 0.85, W * 0.79, W * 0.06, W * 0.04);

  // Face embedded as the center CUSHION of the sofa
  const cx = W / 2, cy = W * 0.56, fw = W * 0.3, fh = W * 0.22;
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    (ctx as any).roundRect(cx - fw / 2, cy - fh / 2, fw, fh, 10);
    ctx.clip();
    ctx.drawImage(faceImg, cx - fw / 2, cy - fh / 2, fw, fh);
    ctx.restore();
    ctx.strokeStyle = "#6b4226";
    ctx.lineWidth = 3;
    ctx.beginPath();
    (ctx as any).roundRect(cx - fw / 2, cy - fh / 2, fw, fh, 10);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#c49a6a";
    ctx.beginPath();
    (ctx as any).roundRect(cx - fw / 2, cy - fh / 2, fw, fh, 10);
    ctx.fill();
    ctx.fillStyle = "#a07848";
    ctx.font = `${W * 0.1}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("😐", cx, cy);
  }

  // Throw pillow on left side of couch
  couch(W * 0.19, W * 0.44, W * 0.12, W * 0.1, "#c17f4a");
  // Remote control on couch
  ctx.fillStyle = "#333";
  ctx.beginPath();
  (ctx as any).roundRect(W * 0.7, W * 0.48, W * 0.06, W * 0.12, 4);
  ctx.fill();
  ctx.fillStyle = "#555";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(W * 0.73, W * 0.515 + i * W * 0.03, W * 0.01, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label at top
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = `bold ${W * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("YOU WANTED A BREAK?", W / 2, W * 0.04);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.font = `${W * 0.032}px sans-serif`;
  ctx.fillText("now you ARE the couch 🛋️", W / 2, W * 0.1);
}

// Scene 2: "You can't stand me?" → guy is a literal chair
function drawChairScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  // Pastel background
  ctx.fillStyle = "#fde8d8";
  ctx.fillRect(0, 0, W, W);
  ctx.fillStyle = "#e8c89a";
  ctx.fillRect(0, W * 0.8, W, W * 0.2);

  // Chair seat
  ctx.fillStyle = "#a0522d";
  ctx.beginPath();
  (ctx as any).roundRect(W * 0.25, W * 0.52, W * 0.5, W * 0.12, 8);
  ctx.fill();
  // Chair back
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  (ctx as any).roundRect(W * 0.3, W * 0.3, W * 0.4, W * 0.24, 8);
  ctx.fill();
  // Chair legs
  ctx.fillStyle = "#6b3410";
  ctx.fillRect(W * 0.27, W * 0.64, W * 0.05, W * 0.18);
  ctx.fillRect(W * 0.68, W * 0.64, W * 0.05, W * 0.18);
  ctx.fillRect(W * 0.29, W * 0.64, W * 0.04, W * 0.15);
  ctx.fillRect(W * 0.67, W * 0.64, W * 0.04, W * 0.15);

  // Face on the chair back
  const cx = W * 0.5, cy = W * 0.42, fr = W * 0.15;
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, fr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, cx - fr, cy - fr, fr * 2, fr * 2);
    ctx.restore();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, fr, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(cx, cy, fr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = `bold ${W * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("CAN'T STAND ME?", W / 2, W * 0.04);
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.font = `${W * 0.032}px sans-serif`;
  ctx.fillText("fine, you're furniture now 🪑", W / 2, W * 0.1);
}

// Scene 3: "You need space?" → face inside astronaut helmet
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
  // Stars
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.9 + 0.1})`;
    const s = Math.random() * 2.5 + 0.5;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * W, s, 0, Math.PI * 2);
    ctx.fill();
  }
  // Distant planet
  ctx.fillStyle = "rgba(255,140,60,0.3)";
  ctx.beginPath();
  ctx.arc(W * 0.82, W * 0.18, W * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,140,60,0.2)";
  ctx.lineWidth = W * 0.025;
  ctx.beginPath();
  ctx.ellipse(W * 0.82, W * 0.18, W * 0.16, W * 0.05, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  const hx = W * 0.5, hy = W * 0.4, hr = W * 0.24;
  // Spacesuit body below helmet
  ctx.fillStyle = "#c8c8c8";
  ctx.beginPath();
  (ctx as any).roundRect(hx - hr * 0.85, hy + hr * 0.75, hr * 1.7, hr * 1.0, 10);
  ctx.fill();
  // NASA/patch badge on suit
  ctx.fillStyle = "#e63946";
  ctx.beginPath();
  (ctx as any).roundRect(hx + hr * 0.2, hy + hr * 0.85, W * 0.1, W * 0.05, 3);
  ctx.fill();

  // Helmet outer shell
  ctx.fillStyle = "#d8d8d8";
  ctx.beginPath();
  ctx.arc(hx, hy, hr, 0, Math.PI * 2);
  ctx.fill();
  // Helmet collar ring
  ctx.strokeStyle = "#b0b0b0";
  ctx.lineWidth = W * 0.05;
  ctx.beginPath();
  ctx.arc(hx, hy, hr * 1.12, Math.PI * 0.3, Math.PI * 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hx, hy, hr * 1.18, -Math.PI * 0.6, -Math.PI * 0.1);
  ctx.stroke();

  // Visor window
  const vr = hr * 0.7;
  // Visor tinted fill
  ctx.fillStyle = "rgba(80,160,220,0.18)";
  ctx.beginPath();
  ctx.arc(hx, hy, vr, 0, Math.PI * 2);
  ctx.fill();
  // Face INSIDE the visor
  if (faceImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(hx, hy, vr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, hx - vr, hy - vr, vr * 2, vr * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(120,200,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hx, hy, vr, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Visor shine glare
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(hx - vr * 0.28, hy - vr * 0.28, vr * 0.3, vr * 0.18, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `bold ${W * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("NEEDED SPACE?", W / 2, W * 0.04);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `${W * 0.032}px sans-serif`;
  ctx.fillText("enjoy orbit, astronaut 🚀", W / 2, W * 0.1);
}

// Scene 4: "You need time?" → face IS the clock
function drawClockScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  faceImg: HTMLImageElement | null
) {
  ctx.fillStyle = "#e8e0d0";
  ctx.fillRect(0, 0, W, W);
  const cx = W / 2, cy = W * 0.45, r = W * 0.3;
  // Clock outer ring
  ctx.fillStyle = "#d4c9b0";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 12, 0, Math.PI * 2);
  ctx.fill();
  // Clock face bg
  ctx.fillStyle = "#fafaf5";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  // Hour marks
  ctx.strokeStyle = "#8B7355";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 9), cy + Math.sin(a) * (r - 9));
    ctx.lineTo(cx + Math.cos(a) * (r - 2), cy + Math.sin(a) * (r - 2));
    ctx.stroke();
  }
  // Face in center of clock
  const fr = r * 0.38;
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
  // Clock hands
  ctx.strokeStyle = "#2c2c2c";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.55);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.38, cy + r * 0.12);
  ctx.stroke();
  ctx.fillStyle = "#2c2c2c";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  // Bell bumps on top
  ctx.strokeStyle = "#8B7355";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(cx - r - 10, cy - r * 0.45);
  ctx.lineTo(cx - r - 10, cy - r * 0.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r + 10, cy - r * 0.45);
  ctx.lineTo(cx + r + 10, cy - r * 0.18);
  ctx.stroke();

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = `bold ${W * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("NEEDED TIME?", W / 2, W * 0.04);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.font = `${W * 0.032}px sans-serif`;
  ctx.fillText("you ARE time now ⏰", W / 2, W * 0.1);
}

// Scene 5: "You are my world?" → face IS the earth
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
  // Stars
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.2})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * W, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const ex = W / 2, ey = W * 0.44, er = W * 0.3;
  // Earth ocean
  ctx.fillStyle = "#1565C0";
  ctx.beginPath();
  ctx.arc(ex, ey, er, 0, Math.PI * 2);
  ctx.fill();
  // Land masses (continents look)
  ctx.fillStyle = "#2E7D32";
  ctx.beginPath();
  ctx.ellipse(ex - er * 0.18, ey - er * 0.18, er * 0.22, er * 0.32, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ex + er * 0.22, ey + er * 0.08, er * 0.18, er * 0.25, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Atmosphere glow
  ctx.strokeStyle = "rgba(79,195,247,0.3)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(ex, ey, er + 12, 0, Math.PI * 2);
  ctx.stroke();
  // Face overlaid on earth
  const fr = er * 0.32;
  if (faceImg) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(ex, ey, fr, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImg, ex - fr, ey - fr, fr * 2, fr * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ex, ey, fr, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `bold ${W * 0.045}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("YOU ARE MY WORLD?", W / 2, W * 0.04);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `${W * 0.032}px sans-serif`;
  ctx.fillText("literally — the whole planet 🌍", W / 2, W * 0.1);
}

const SCENE_DRAW: Record<
  string,
  (ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) => void
> = {
  couch: drawBreakScene,
  space: drawSpaceScene,
  clock: drawClockScene,
  world: drawWorldScene,
  pill: drawWorldScene,
};

// Special mapping: question id → specific draw fn
const DRAW_BY_ID: Record<
  number,
  (ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) => void
> = {
  1: drawBreakScene,   // "want a break?" → sofa
  2: drawChairScene,   // "can't stand me?" → chair
  3: drawSpaceScene,   // "need space?" → astronaut helmet
  4: drawClockScene,   // "need time?" → clock face
  5: drawWorldScene,   // "my world?" → earth
};

export default function MemeRevealScreen({ userData, onNavigate }: MemeRevealScreenProps) {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showExit, setShowExit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [faceImg, setFaceImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      if (ctx) {
        const drawFn = DRAW_BY_ID[activeQuestion.id] || SCENE_DRAW[activeQuestion.scene];
        drawFn(ctx, 400, faceImg);
      }
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
    setShowMessage(false);
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
      <div className="px-4 py-4 space-y-3 pb-40">
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

        {/* EXIT button — always visible below questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowExit(true)}
            className="w-full h-12 rounded-xl border-border/50 text-muted-foreground gap-2"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </Button>
        </motion.div>
      </div>

      {/* Exit confirmation → private message box */}
      <AnimatePresence>
        {showExit && !messageSent && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border/40 rounded-t-3xl p-6 shadow-2xl"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            {!showMessage ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">Before you go…</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Leave a private message for {userData.nickname || "them"}? Only they can see it 🔒
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setShowExit(false); onNavigate("final"); }}
                    className="flex-1 h-11 rounded-xl border-border/50"
                  >
                    Skip & Exit
                  </Button>
                  <Button
                    onClick={() => setShowMessage(true)}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Write message
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                  <Button
                    variant="outline"
                    onClick={() => setShowMessage(false)}
                    className="flex-1 h-11 rounded-xl border-border/50"
                  >
                    Back
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message sent confirmation */}
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
            className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center px-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-4"
              >
                <p className="text-white/60 text-sm mb-1">When you say…</p>
                <h2 className="text-white text-2xl font-bold">{activeQuestion.question}</h2>
              </motion.div>

              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
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
