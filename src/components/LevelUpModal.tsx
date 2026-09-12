"use client";

import { AnimatePresence, motion } from "framer-motion";
import { titleForLevel } from "@/lib/xp";

export default function LevelUpModal({
  level,
  onClose,
}: {
  level: number | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b2430]/75 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="levelup-heading"
          onClick={onClose}
        >
          <motion.div
            className="max-w-sm rounded-[28px] border border-[#e8a24b]/25 bg-[#2e3644] p-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
            initial={{ scale: 0.86, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.span
              className="inline-block text-6xl"
              animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 0.8 }}
              aria-hidden="true"
            >
              ✨
            </motion.span>
            <h2 id="levelup-heading" className="mt-3 font-display text-4xl text-[#f5d39e]">
              Level {level}
            </h2>
            <p className="mt-2 text-[#f5ebdc]">Your room grows with you.</p>
            <div className="mt-4 inline-flex rounded-full border border-[#e8a24b]/25 bg-[#e8a24b]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#f2c983]">
              + New growth unlocked
            </div>
            <p className="mt-4 text-sm text-[#d9cdb8]">You are now the {titleForLevel(level)}.</p>
            <button
              onClick={onClose}
              autoFocus
              className="cozy-button mt-6"
            >
              Keep going
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
