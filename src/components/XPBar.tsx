"use client";

import { motion } from "framer-motion";

interface Props {
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

export default function XPBar({ xpIntoLevel, xpForNextLevel, progress }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-[#d4c8b3]">
        <span>Progress</span>
        <span>
          {xpIntoLevel} / {xpForNextLevel} XP
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Progress to next level"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-4 w-full overflow-hidden rounded-full bg-[#1b2430] shadow-inner shadow-black/10"
      >
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#f2c983,#e8a24b)] shadow-[0_0_25px_rgba(232,162,75,0.35)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
