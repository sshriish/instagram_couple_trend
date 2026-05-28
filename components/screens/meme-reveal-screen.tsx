"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, ChevronDown, LogOut } from "lucide-react";
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
  revealText: string; // only shown in modal after tap
  emoji: string;
  unlocked: boolean;
}

const QUESTIONS: Question[] = [
  { id: 1,  question: "You want a break?",        revealText: "Fine. Become the sofa then 🛋️",         emoji: "☕",  unlocked: false },
  { id: 2,  question: "You can't stand me?",       revealText: "Okay... you ARE the chair now 🪑",       emoji: "🪑",  unlocked: false },
  { id: 3,  question: "You need space?",           revealText: "Way ahead of you, astronaut 🚀",         emoji: "🚀",  unlocked: false },
  { id: 4,  question: "You need time?",            revealText: "Okay, you ARE time now ⏰",              emoji: "⏰",  unlocked: false },
  { id: 5,  question: "You are my world?",         revealText: "Literally. The whole planet 🌍",         emoji: "🌍",  unlocked: false },
  { id: 6,  question: "You're so cold to me?",     revealText: "Surprise — you're an iceberg 🧊",        emoji: "🧊",  unlocked: false },
  { id: 7,  question: "You drive me crazy?",       revealText: "Congrats, you're a steering wheel 🚗",   emoji: "🚗",  unlocked: false },
  { id: 8,  question: "You're a pain?",            revealText: "Medically confirmed — you're a pill 💊", emoji: "💊",  unlocked: false },
];

// ─── Scene Drawers ────────────────────────────────────────────────────────────

function drawBreakScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  ctx.fillStyle = "#f5ede0"; ctx.fillRect(0,0,W,W);
  ctx.fillStyle = "#d4a96a"; ctx.fillRect(0, W*.78, W, W*.22);
  const box = (x:number,y:number,w:number,h:number,c:string,r=14)=>{ctx.fillStyle=c;ctx.beginPath();(ctx as any).roundRect(x,y,w,h,r);ctx.fill();};
  box(W*.04,W*.5,W*.92,W*.32,"#8B5E3C");
  box(W*.04,W*.42,W*.92,W*.14,"#9C6B45");
  box(W*.04,W*.4,W*.15,W*.42,"#7A4F2D");
  box(W*.81,W*.4,W*.15,W*.42,"#7A4F2D");
  box(W*.02,W*.36,W*.19,W*.1,"#9C6B45");
  box(W*.79,W*.36,W*.19,W*.1,"#9C6B45");
  ctx.fillStyle="#6b4226"; ctx.fillRect(W*.09,W*.79,W*.06,W*.04); ctx.fillRect(W*.85,W*.79,W*.06,W*.04);
  const cx=W/2,cy=W*.56,fw=W*.3,fh=W*.22;
  if(img){ctx.save();ctx.beginPath();(ctx as any).roundRect(cx-fw/2,cy-fh/2,fw,fh,10);ctx.clip();ctx.drawImage(img,cx-fw/2,cy-fh/2,fw,fh);ctx.restore();ctx.strokeStyle="#6b4226";ctx.lineWidth=3;ctx.beginPath();(ctx as any).roundRect(cx-fw/2,cy-fh/2,fw,fh,10);ctx.stroke();}
  else{ctx.fillStyle="#c49a6a";ctx.beginPath();(ctx as any).roundRect(cx-fw/2,cy-fh/2,fw,fh,10);ctx.fill();}
  box(W*.19,W*.44,W*.12,W*.1,"#c17f4a");
  ctx.fillStyle="#333";ctx.beginPath();(ctx as any).roundRect(W*.7,W*.48,W*.06,W*.12,4);ctx.fill();
}

function drawChairScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  ctx.fillStyle="#fde8d8";ctx.fillRect(0,0,W,W);
  ctx.fillStyle="#e8c89a";ctx.fillRect(0,W*.8,W,W*.2);
  const box=(x:number,y:number,w:number,h:number,c:string,r=8)=>{ctx.fillStyle=c;ctx.beginPath();(ctx as any).roundRect(x,y,w,h,r);ctx.fill();};
  box(W*.25,W*.52,W*.5,W*.12,"#a0522d");
  box(W*.3,W*.3,W*.4,W*.24,"#8B4513");
  ctx.fillStyle="#6b3410";ctx.fillRect(W*.27,W*.64,W*.05,W*.18);ctx.fillRect(W*.68,W*.64,W*.05,W*.18);
  const cx=W*.5,cy=W*.42,fr=W*.14;
  if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,cx-fr,cy-fr,fr*2,fr*2);ctx.restore();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.stroke();}
  else{ctx.fillStyle="#ddd";ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.fill();}
}

function drawSpaceScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  const g=ctx.createRadialGradient(W/2,W/2,10,W/2,W/2,W*.7);g.addColorStop(0,"#1a1a4e");g.addColorStop(1,"#070714");ctx.fillStyle=g;ctx.fillRect(0,0,W,W);
  for(let i=0;i<100;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.9+.1})`;ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*W,Math.random()*2+.5,0,Math.PI*2);ctx.fill();}
  const hx=W*.5,hy=W*.4,hr=W*.24;
  ctx.fillStyle="#c8c8c8";ctx.beginPath();(ctx as any).roundRect(hx-hr*.85,hy+hr*.75,hr*1.7,hr*1.0,10);ctx.fill();
  ctx.fillStyle="#d8d8d8";ctx.beginPath();ctx.arc(hx,hy,hr,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#b0b0b0";ctx.lineWidth=W*.05;ctx.beginPath();ctx.arc(hx,hy,hr*1.12,Math.PI*.3,Math.PI*.7);ctx.stroke();
  const vr=hr*.7;
  ctx.fillStyle="rgba(80,160,220,0.18)";ctx.beginPath();ctx.arc(hx,hy,vr,0,Math.PI*2);ctx.fill();
  if(img){ctx.save();ctx.beginPath();ctx.arc(hx,hy,vr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,hx-vr,hy-vr,vr*2,vr*2);ctx.restore();ctx.strokeStyle="rgba(120,200,255,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,vr,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle="rgba(255,255,255,0.08)";ctx.beginPath();ctx.ellipse(hx-vr*.28,hy-vr*.28,vr*.3,vr*.18,-0.5,0,Math.PI*2);ctx.fill();
}

function drawClockScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  ctx.fillStyle="#e8e0d0";ctx.fillRect(0,0,W,W);
  const cx=W/2,cy=W*.45,r=W*.3;
  ctx.fillStyle="#d4c9b0";ctx.beginPath();ctx.arc(cx,cy,r+12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#fafaf5";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#8B7355";ctx.lineWidth=3;
  for(let i=0;i<12;i++){const a=(i*Math.PI)/6-Math.PI/2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(r-9),cy+Math.sin(a)*(r-9));ctx.lineTo(cx+Math.cos(a)*(r-2),cy+Math.sin(a)*(r-2));ctx.stroke();}
  const fr=r*.38;
  if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,cx-fr,cy-fr,fr*2,fr*2);ctx.restore();ctx.strokeStyle="rgba(139,115,85,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.stroke();}
  ctx.strokeStyle="#2c2c2c";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-r*.55);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*.38,cy+r*.12);ctx.stroke();ctx.fillStyle="#2c2c2c";ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fill();
}

function drawWorldScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  const g=ctx.createRadialGradient(W/2,W/2,W*.1,W/2,W/2,W*.6);g.addColorStop(0,"#1a3a5c");g.addColorStop(1,"#0d1f35");ctx.fillStyle=g;ctx.fillRect(0,0,W,W);
  for(let i=0;i<60;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.7+.2})`;ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*W,Math.random()*1.5+.5,0,Math.PI*2);ctx.fill();}
  const ex=W/2,ey=W*.44,er=W*.3;
  ctx.fillStyle="#1565C0";ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#2E7D32";ctx.beginPath();ctx.ellipse(ex-er*.18,ey-er*.18,er*.22,er*.32,.3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(ex+er*.22,ey+er*.08,er*.18,er*.25,.15,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(79,195,247,0.3)";ctx.lineWidth=8;ctx.beginPath();ctx.arc(ex,ey,er+12,0,Math.PI*2);ctx.stroke();
  const fr=er*.32;
  if(img){ctx.save();ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(ex,ey,fr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,ex-fr,ey-fr,fr*2,fr*2);ctx.restore();ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,fr,0,Math.PI*2);ctx.stroke();}
}

function drawIcebergScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  // Ocean gradient
  const og=ctx.createLinearGradient(0,0,0,W);og.addColorStop(0,"#b3e5fc");og.addColorStop(.5,"#0288d1");og.addColorStop(1,"#01579b");ctx.fillStyle=og;ctx.fillRect(0,0,W,W);
  // Water line
  ctx.fillStyle="rgba(255,255,255,0.15)";ctx.fillRect(0,W*.45,W,W*.04);
  // Iceberg above water
  ctx.fillStyle="#e3f2fd";ctx.beginPath();ctx.moveTo(W*.35,W*.45);ctx.lineTo(W*.28,W*.2);ctx.lineTo(W*.5,W*.08);ctx.lineTo(W*.72,W*.18);ctx.lineTo(W*.68,W*.45);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(144,202,249,0.8)";ctx.lineWidth=2;ctx.stroke();
  // Iceberg below water (bigger)
  ctx.fillStyle="rgba(179,229,252,0.5)";ctx.beginPath();ctx.moveTo(W*.32,W*.47);ctx.lineTo(W*.2,W*.7);ctx.lineTo(W*.3,W*.88);ctx.lineTo(W*.55,W*.92);ctx.lineTo(W*.78,W*.82);ctx.lineTo(W*.72,W*.55);ctx.lineTo(W*.68,W*.47);ctx.closePath();ctx.fill();
  // Face on iceberg tip
  const cx=W*.5,cy=W*.28,fr=W*.14;
  if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,cx-fr,cy-fr,fr*2,fr*2);ctx.restore();ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.stroke();}
  else{ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.fill();}
  // Snowflakes
  ctx.fillStyle="rgba(255,255,255,0.6)";ctx.font=`${W*.04}px serif`;ctx.textAlign="center";
  ["❄","❄","❄"].forEach((_,i)=>ctx.fillText("❄",W*(0.15+i*.35),W*.06));
}

function drawCarScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  // Road background
  ctx.fillStyle="#87CEEB";ctx.fillRect(0,0,W,W*.6);
  ctx.fillStyle="#555";ctx.fillRect(0,W*.6,W,W*.4);
  ctx.fillStyle="#fff";for(let i=0;i<5;i++){ctx.fillRect(W*(.05+i*.2),W*.76,W*.12,W*.04);}
  // Car body
  ctx.fillStyle="#e63946";ctx.beginPath();(ctx as any).roundRect(W*.08,W*.42,W*.84,W*.28,12);ctx.fill();
  // Car roof
  ctx.fillStyle="#c1121f";ctx.beginPath();(ctx as any).roundRect(W*.22,W*.26,W*.56,W*.22,10);ctx.fill();
  // Windows
  ctx.fillStyle="rgba(173,216,230,0.8)";ctx.beginPath();(ctx as any).roundRect(W*.26,W*.29,W*.22,W*.16,6);ctx.fill();ctx.beginPath();(ctx as any).roundRect(W*.52,W*.29,W*.22,W*.16,6);ctx.fill();
  // Wheels
  ctx.fillStyle="#222";[W*.22,W*.72].forEach(x=>{ctx.beginPath();ctx.arc(x,W*.7,W*.09,0,Math.PI*2);ctx.fill();ctx.fillStyle="#888";ctx.beginPath();ctx.arc(x,W*.7,W*.05,0,Math.PI*2);ctx.fill();ctx.fillStyle="#222";});
  // Steering wheel with face
  const cx=W*.5,cy=W*.36,fr=W*.1;
  ctx.fillStyle="#333";ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.fill();
  if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,fr*.85,0,Math.PI*2);ctx.clip();ctx.drawImage(img,cx-fr*.85,cy-fr*.85,fr*1.7,fr*1.7);ctx.restore();}
  ctx.strokeStyle="#555";ctx.lineWidth=W*.025;ctx.beginPath();ctx.moveTo(cx-fr,cy);ctx.lineTo(cx+fr,cy);ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy-fr);ctx.lineTo(cx,cy+fr);ctx.stroke();
}

function drawPillScene(ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) {
  ctx.fillStyle="#f8f0ff";ctx.fillRect(0,0,W,W);
  // Pill shape
  const px=W*.2,py=W*.28,pw=W*.6,ph=W*.28;
  ctx.fillStyle="#e040fb";ctx.beginPath();ctx.arc(px+ph/2,py+ph/2,ph/2,Math.PI*.5,Math.PI*1.5);ctx.lineTo(px+pw-ph/2,py);ctx.arc(px+pw-ph/2,py+ph/2,ph/2,-Math.PI*.5,Math.PI*.5);ctx.lineTo(px+ph/2,py+ph);ctx.closePath();ctx.fill();
  ctx.fillStyle="#f48fb1";ctx.beginPath();ctx.arc(px+pw-ph/2,py+ph/2,ph/2,-Math.PI*.5,Math.PI*.5);ctx.lineTo(px+pw/2,py+ph);ctx.lineTo(px+pw/2,py);ctx.closePath();ctx.fill();
  // Divider line
  ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+pw/2,py+4);ctx.lineTo(px+pw/2,py+ph-4);ctx.stroke();
  // Face in left half of pill
  const cx=W*.35,cy=W*.42,fr=W*.1;
  if(img){ctx.save();ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.clip();ctx.drawImage(img,cx-fr,cy-fr,fr*2,fr*2);ctx.restore();ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,fr,0,Math.PI*2);ctx.stroke();}
  // Little pills scattered
  ctx.fillStyle="rgba(224,64,251,0.3)";[[W*.15,W*.7],[W*.75,W*.65],[W*.5,W*.75],[W*.3,W*.82],[W*.65,W*.8]].forEach(([x,y])=>{ctx.beginPath();(ctx as any).roundRect(x,y,W*.1,W*.05,W*.025);ctx.fill();});
}

const DRAW_BY_ID: Record<number, (ctx: CanvasRenderingContext2D, W: number, img: HTMLImageElement | null) => void> = {
  1: drawBreakScene,
  2: drawChairScene,
  3: drawSpaceScene,
  4: drawClockScene,
  5: drawWorldScene,
  6: drawIcebergScene,
  7: drawCarScene,
  8: drawPillScene,
};

// ─── Component ────────────────────────────────────────────────────────────────

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
      canvas.width = 400; canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) DRAW_BY_ID[activeQuestion.id]?.(ctx, 400, faceImg);
    }
  }, [activeQuestion, faceImg]);

  const handleQuestionTap = (q: Question) => {
    setActiveQuestion(q);
    setQuestions((prev) => prev.map((item) => item.id === q.id ? { ...item, unlocked: true } : item));
  };

  const handleClose = () => setActiveQuestion(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = userData.shareLink?.split("/share/")[1];
      if (token) {
        await supabase.from("meme_sessions").update({ private_message: message }).eq("token", token);
      }
    } catch (e) { console.error(e); }
    setMessageSent(true);
    setShowMessage(false);
    setShowExit(false);
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

      {/* Questions list — NO subtext shown here */}
      <div className="px-4 py-4 space-y-3 pb-40">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => handleQuestionTap(q)}
            className={`
              relative cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden
              ${q.unlocked ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card hover:border-primary/30 hover:bg-muted/30"}
            `}
          >
            <div className="flex items-center gap-4 p-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${q.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                {q.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base leading-tight">{q.question}</p>
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
            {q.unlocked && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary" />}
          </motion.div>
        ))}

        {/* Exit button below all questions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-4">
          <Button
            variant="outline" size="lg"
            onClick={() => setShowExit(true)}
            className="w-full h-12 rounded-xl border-border/50 text-muted-foreground gap-2"
          >
            <LogOut className="w-4 h-4" />
            Exit & leave a message
          </Button>
        </motion.div>
      </div>

      {/* Exit → private message sheet */}
      <AnimatePresence>
        {showExit && !messageSent && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
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
                  <Button variant="outline" onClick={() => { setShowExit(false); onNavigate("final"); }} className="flex-1 h-11 rounded-xl border-border/50">
                    Skip & Exit
                  </Button>
                  <Button onClick={() => setShowMessage(true)} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold">
                    <Lock className="w-4 h-4 mr-2" />Write message
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
                  Only {userData.nickname || "they"} can see this 💬
                </p>
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type something honest... or chaotic 🔥" rows={4}
                  className="w-full rounded-xl border border-border/60 bg-muted/40 p-3 text-sm resize-none focus:outline-none focus:border-primary/60 transition-colors"
                />
                <div className="flex gap-3 mt-3">
                  <Button variant="outline" onClick={() => setShowMessage(false)} className="flex-1 h-11 rounded-xl border-border/50">Back</Button>
                  <Button onClick={handleSendMessage} disabled={!message.trim()} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold">
                    <Send className="w-4 h-4 mr-2" />Send
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message sent */}
      <AnimatePresence>
        {messageSent && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/30 space-y-3"
          >
            <p className="text-center text-sm text-primary font-medium">Message sent 🔒 Only they can see it</p>
            <Button size="lg" onClick={() => onNavigate("final")} className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-secondary rounded-xl">Exit</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meme reveal modal */}
      <AnimatePresence>
        {activeQuestion && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-center mb-4">
                <p className="text-white/60 text-sm mb-1">When you say…</p>
                <h2 className="text-white text-2xl font-bold">{activeQuestion.question}</h2>
              </motion.div>

              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <canvas ref={canvasRef} className="w-full" style={{ aspectRatio: "1", display: "block" }} />
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-4 space-y-3">
                <p className="text-white/80 text-base font-medium">{activeQuestion.revealText}</p>
                <button onClick={handleClose} className="flex items-center gap-2 mx-auto text-white/50 hover:text-white transition-colors text-sm">
                  <ChevronDown className="w-4 h-4" />Back to questions
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
    }
