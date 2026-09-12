"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ATTRIBUTES, DIFFICULTY_REWARDS, Difficulty } from "@/lib/xp";

export interface UiTask {
  id: string;
  title: string;
  attribute: string;
  difficulty: Difficulty;
  status: "ACTIVE" | "DONE";
  pending?: boolean;
}

interface Props {
  tasks: UiTask[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function attrLabel(key: string) {
  return ATTRIBUTES.find((a) => a.key === key)?.label ?? key;
}

export default function TaskList({ tasks, onComplete, onDelete }: Props) {
  const active = tasks.filter((t) => t.status === "ACTIVE");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <div className="space-y-5">
      <div className="cozy-panel p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl text-[#f7ebdd]">Quest board</h3>
          <span className="rounded-full border border-white/10 bg-[#1b2430]/60 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-[#d8cab2]">
            {active.length} active
          </span>
        </div>

        {active.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-[#1b2430]/50 px-4 py-3 text-sm text-[#d5c7af]">
            Nothing on the list. Add something small — it still counts.
          </p>
        )}

        <ul className="space-y-3" aria-label="Active tasks">
          <AnimatePresence initial={false}>
            {active.map((task) => {
              const reward = DIFFICULTY_REWARDS[task.difficulty];
              return (
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 32 }}
                  className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#1d2530]/75 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onComplete(task.id)}
                      disabled={task.pending}
                      aria-label={`Mark "${task.title}" as done`}
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#e8a24b]/80 text-[10px] font-bold text-[#1d2430] transition-all duration-200 disabled:cursor-wait ${task.pending ? "animate-pulse bg-[#e8a24b]/30" : "bg-[#e8a24b]/15 hover:bg-[#e8a24b]/25 active:scale-95"}`}
                    >
                      {task.pending ? "…" : ""}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-base font-semibold text-[#f7ebdc]">{task.title}</p>
                        <span className="shrink-0 rounded-full bg-[#e8a24b]/15 px-2.5 py-1 text-xs font-semibold text-[#f7d49d]">
                          +{reward.xp} XP
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#d5c7af]">
                        <span className="rounded-full border border-white/10 bg-[#131d2a]/80 px-2 py-1">{attrLabel(task.attribute)}</span>
                        <span className="rounded-full border border-white/10 bg-[#131d2a]/80 px-2 py-1">+{reward.embers} embers</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(task.id)}
                      aria-label={`Delete "${task.title}"`}
                      className="rounded-full px-2 py-1 text-xs font-medium text-[#d5c7af] transition hover:bg-white/5 hover:text-[#f7d9d9]"
                    >
                      Remove
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {done.length > 0 && (
        <div className="cozy-panel p-4 sm:p-5">
          <h3 className="mb-3 font-display text-2xl text-[#d8cab2]">Completed</h3>
          <ul className="space-y-3" aria-label="Completed tasks">
            {done.map((task) => (
              <li key={task.id} className="flex items-center gap-3 rounded-[20px] border border-[#7c9473]/25 bg-[#7c9473]/10 px-3.5 py-3 opacity-90">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c9473] text-xs font-bold text-[#15202d]" aria-hidden="true">
                  ✓
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base text-[#e4dccb] line-through">{task.title}</p>
                  <p className="mt-1 text-[11px] text-[#d1c8b4]">Quest complete</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
