"use client";

import { motion } from "framer-motion";
import { SHOP_CATALOG } from "@/lib/shop";

interface Props {
  level: number;
  levelTitle: string;
  equippedKeys: string[];
}

export default function RoomScene({ level, levelTitle, equippedKeys }: Props) {
  const equippedItems = SHOP_CATALOG.filter((i) => equippedKeys.includes(i.key));

  return (
    <section
      aria-label="Your study room"
      className="room-shell relative p-4 sm:p-5"
    >
      <div className="ambient-orb left-8 top-6 h-20 w-20 opacity-40" aria-hidden="true" />
      <div className="ambient-orb right-6 top-8 h-24 w-24 opacity-30" aria-hidden="true" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#d8cab2]">Level {level}</p>
          <h2 className="mt-2 font-display text-3xl text-[#f7ebdd]">{levelTitle}</h2>
        </div>
        <span className="rounded-full border border-[#e8a24b]/20 bg-[#e8a24b]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f5d39e]">
          Cozy room
        </span>
      </div>

      <div className="relative mt-5 h-[270px] overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,rgba(27,33,42,0.78),rgba(43,56,68,0.9))]" aria-hidden="true">
        <div className="room-window">
          <div className="moon-dot">🌙</div>
        </div>

        <div className="room-lamp" style={{ left: "1.8rem" }} />
        <div className="room-table" style={{ bottom: "1.8rem", width: "70%" }} />
        <div className="room-shelf" style={{ width: "54%", top: "7.8rem" }} />
        <div className="room-plant" style={{ left: "2.5rem", bottom: "2.5rem" }}>🪴</div>
        <div className="room-book" style={{ left: "36%", top: "5.9rem" }}>📚</div>
        <div className="room-book" style={{ left: "49%", top: "5.9rem" }}>📖</div>
        <div className="room-book" style={{ left: "58%", top: "5.9rem" }}>📘</div>
        <div className="room-cat" style={{ right: "3rem" }}>🐈</div>
        <div className="absolute bottom-5 left-7 text-4xl">🪑</div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Items in your room">
        {equippedItems.length === 0 && (
          <li className="rounded-full border border-white/10 bg-[#1b2430]/60 px-3 py-1.5 text-sm text-[#d5c7af]">
            Your room is bare — visit the Nook to add something.
          </li>
        )}
        {equippedItems.map((item) => (
          <motion.li
            key={item.key}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1b2430]/70 px-3 py-1.5 text-sm text-[#f4ebdc]"
            title={item.name}
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.name}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
