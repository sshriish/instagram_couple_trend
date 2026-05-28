"use client";

import { motion } from "framer-motion";

const floatingMemes = [
  { emoji: "⏰", x: "10%", y: "15%", delay: 0, duration: 6 },
  { emoji: "🚀", x: "85%", y: "20%", delay: 1, duration: 7 },
  { emoji: "🪑", x: "15%", y: "75%", delay: 2, duration: 5 },
  { emoji: "🌍", x: "80%", y: "70%", delay: 0.5, duration: 8 },
  { emoji: "💊", x: "50%", y: "10%", delay: 1.5, duration: 6 },
  { emoji: "💔", x: "90%", y: "45%", delay: 3, duration: 7 },
  { emoji: "🔥", x: "5%", y: "50%", delay: 2.5, duration: 5.5 },
  { emoji: "👀", x: "70%", y: "85%", delay: 1, duration: 6.5 },
];

export default function FloatingMemes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingMemes.map((meme, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl md:text-5xl opacity-20"
          style={{ left: meme.x, top: meme.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8],
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: meme.duration,
            delay: meme.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {meme.emoji}
        </motion.div>
      ))}

      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.line
          x1="10%"
          y1="15%"
          x2="85%"
          y2="20%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.line
          x1="15%"
          y1="75%"
          x2="80%"
          y2="70%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
