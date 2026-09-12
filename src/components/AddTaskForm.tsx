"use client";

import { useState } from "react";
import { ATTRIBUTES, AttributeKey, Difficulty } from "@/lib/xp";

interface Props {
  onAdd: (data: { title: string; attribute: AttributeKey; difficulty: Difficulty }) => Promise<boolean>;
}

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: "EASY", label: "Easy" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HARD", label: "Hard" },
];

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [attribute, setAttribute] = useState<AttributeKey>("FOCUS");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title first.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const ok = await onAdd({ title: title.trim(), attribute, difficulty });
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setAttribute("FOCUS");
      setDifficulty("EASY");
    } else {
      setError("Couldn't add that task — try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cozy-panel p-4 sm:p-5" aria-label="Add a new task">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#d5c7af]">New quest</p>
          <h3 className="mt-1 font-display text-2xl text-[#f7ebdd]">Add a task</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-[#1b2430]/60 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-[#d5c7af]">
          {difficulty}
        </span>
      </div>

      <div className="space-y-3">
        <label htmlFor="new-task-title" className="sr-only">
          Task title
        </label>
        <input
          id="new-task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task for your room…"
          maxLength={140}
          className="cozy-input"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="new-task-attribute" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#d5c7af]">
              Attribute
            </label>
            <select
              id="new-task-attribute"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value as AttributeKey)}
              className="cozy-input"
            >
              {ATTRIBUTES.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-task-difficulty" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#d5c7af]">
              Difficulty
            </label>
            <select
              id="new-task-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="cozy-input"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-2xl border border-[#c97c82]/30 bg-[#c97c82]/10 px-3 py-2 text-sm text-[#f7d0d5]">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="cozy-button mt-4 w-full sm:w-auto">
        {submitting ? "Adding…" : "Add quest"}
      </button>
    </form>
  );
}
