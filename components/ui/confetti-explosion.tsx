"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  scale: number;
  emoji?: string;
}

const colors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-yellow-400",
];

const emojis = ["🎉", "✨", "💖", "🔥", "⭐", "💫", "🎊"];

export default function ConfettiExplosion() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      emoji: i % 5 === 0 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
    }));

    setConfetti(pieces);

    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{ left: `${piece.x}%`, top: "-5%" }}
              initial={{
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "120vh",
                rotate: piece.rotation * 3,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
            >
              {piece.emoji ? (
                <span
                  className="text-2xl"
                  style={{ transform: `scale(${piece.scale})` }}
                >
                  {piece.emoji}
                </span>
              ) : (
                <div
                  className={`w-3 h-3 ${piece.color} rounded-sm`}
                  style={{ transform: `scale(${piece.scale})` }}
                />
              )}
            </motion.div>
          ))}

          {/* Floating emoji burst from center */}
          {emojis.slice(0, 4).map((emoji, i) => (
            <motion.div
              key={`burst-${i}`}
              className="absolute left-1/2 top-1/2 text-4xl"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                x: (i % 2 === 0 ? 1 : -1) * (80 + i * 30),
                y: (i < 2 ? -1 : 1) * (60 + i * 20),
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
