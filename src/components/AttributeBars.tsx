"use client";

import { motion } from "framer-motion";
import { ATTRIBUTES, AttributeKey } from "@/lib/xp";

export default function AttributeBars({ attributeXp }: { attributeXp: Record<AttributeKey, number> }) {
  const max = Math.max(50, ...Object.values(attributeXp));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3" aria-label="Character attributes">
      {ATTRIBUTES.map((attr) => {
        const value = attributeXp[attr.key] ?? 0;
        const pct = Math.min(100, (value / max) * 100);
        return (
          <div key={attr.key}>
            <div className="flex justify-between text-xs text-parchmentDim mb-1">
              <span>{attr.label}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-dusk overflow-hidden" aria-hidden="true">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: attr.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
