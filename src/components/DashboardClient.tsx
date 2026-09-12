"use client";

import { useEffect, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  computeLevel,
  titleForLevel,
  parseAttributeXp,
  AttributeKey,
  Difficulty,
} from "@/lib/xp";
import RoomScene from "./RoomScene";
import XPBar from "./XPBar";
import StreakCandle from "./StreakCandle";
import AttributeBars from "./AttributeBars";
import TaskList, { UiTask } from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import Shop from "./Shop";
import LevelUpModal from "./LevelUpModal";
import { DashboardSkeleton } from "./Skeletons";

interface UserState {
  xp: number;
  embers: number;
  attributeXp: string;
  currentStreak: number;
}

interface InventoryRow {
  itemKey: string;
  equipped: boolean;
}

export default function DashboardClient({ userName }: { userName: string }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [tasks, setTasks] = useState<UiTask[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const [busyShopKey, setBusyShopKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const displayName = userName && userName !== "there" ? userName : "Adventurer";

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [tasksRes, shopRes] = await Promise.all([fetch("/api/tasks"), fetch("/api/shop")]);
      if (!tasksRes.ok || !shopRes.ok) throw new Error("Could not load your room.");
      const tasksData = await tasksRes.json();
      const shopData = await shopRes.json();
      setUser(tasksData.user);
      setTasks(tasksData.tasks);
      setInventory(shopData.inventory);
    } catch {
      setLoadError("Couldn't reach your room. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) return <DashboardSkeleton />;

  if (loadError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[#f5ebdc]">{loadError || "Something went wrong."}</p>
        <button onClick={loadAll} className="cozy-button">
          Try again
        </button>
      </div>
    );
  }

  const levelInfo = computeLevel(user.xp);
  const attributeXp = parseAttributeXp(user.attributeXp);
  const equippedKeys = inventory.filter((i) => i.equipped).map((i) => i.itemKey);

  async function handleAddTask(data: { title: string; attribute: AttributeKey; difficulty: Difficulty }) {
    const tempId = `temp-${Date.now()}`;
    setTasks((prev) => [{ id: tempId, title: data.title, attribute: data.attribute, difficulty: data.difficulty, status: "ACTIVE", pending: true }, ...prev]);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...created, pending: false } : t)));
      return true;
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      flashToast("Couldn't add that task — check your connection.");
      return false;
    }
  }

  async function handleComplete(id: string) {
    const previousTasks = tasks;
    const previousUser = user;
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === "DONE") return;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "DONE", pending: true } : t)));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setUser(data.user);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, pending: false } : t)));
      if (data.leveledUp) setLevelUpTo(data.newLevel);
      if (data.streakIncreased) flashToast(`Streak: ${data.user.currentStreak} day${data.user.currentStreak === 1 ? "" : "s"} 🕯️`);
    } catch (e: any) {
      setTasks(previousTasks);
      setUser(previousUser);
      flashToast(e?.message || "Couldn't complete that task — try again.");
    }
  }

  async function handleDelete(id: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(previous);
      flashToast("Couldn't delete that task — try again.");
    }
  }

  async function handleBuy(key: string) {
    setBusyShopKey(key);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, action: "buy" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUser((u) => (u ? { ...u, embers: data.updatedUser.embers } : u));
      setInventory((prev) => [...prev, data.inventoryItem]);
      flashToast(`Added ${key.replace(/-/g, " ")} to your room.`);
    } catch (e: any) {
      flashToast(e?.message || "Couldn't buy that — try again.");
    } finally {
      setBusyShopKey(null);
    }
  }

  async function handleToggle(key: string) {
    setBusyShopKey(key);
    const previous = inventory;
    setInventory((prev) => prev.map((i) => (i.itemKey === key ? { ...i, equipped: !i.equipped } : i)));
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, action: "toggle" }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setInventory(previous);
      flashToast("Couldn't update that item — try again.");
    } finally {
      setBusyShopKey(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="cozy-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#c8bfa8]">Good evening</p>
              <h1 className="mt-2 font-display text-3xl text-[#f6ebdd] sm:text-[2.4rem]">
                {displayName}. <span className="text-[#f2c983]">🌙</span>
              </h1>
              <p className="mt-2 text-[#d6c9b0]">Your room grows with every quest you complete.</p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="cozy-button-secondary self-start px-4 py-2.5 text-xs uppercase tracking-[0.14em]"
            >
              Sign out
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#1b2430]/70 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9bda8]">Level</p>
              <p className="mt-2 font-display text-3xl text-[#f7ebdc]">{levelInfo.level}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1b2430]/70 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9bda8]">XP</p>
              <p className="mt-2 font-display text-3xl text-[#f7ebdc]">{user.xp}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1b2430]/70 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9bda8]">Streak</p>
              <p className="mt-2 font-display text-3xl text-[#f7ebdc]">{user.currentStreak}d</p>
            </div>
            <div className="rounded-2xl border border-[#e8a24b]/15 bg-[#e8a24b]/10 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#f0dca6]">Embers</p>
              <p className="mt-2 font-display text-3xl text-[#f7ebdc]">{user.embers}</p>
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.18fr]">
          <div className="space-y-5">
            <RoomScene level={levelInfo.level} levelTitle={titleForLevel(levelInfo.level)} equippedKeys={equippedKeys} />

            <div className="cozy-panel p-5">
              <XPBar xpIntoLevel={levelInfo.xpIntoLevel} xpForNextLevel={levelInfo.xpForNextLevel} progress={levelInfo.progress} />

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <StreakCandle streak={user.currentStreak} />
                <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a24b]/25 bg-[#e8a24b]/10 px-3 py-1.5 text-sm font-semibold text-[#f5d39e]">
                  <span aria-hidden="true">🔥</span>
                  {user.embers} Embers
                </span>
              </div>

              <div className="mt-5">
                <AttributeBars attributeXp={attributeXp} />
              </div>
            </div>

            <Shop embers={user.embers} inventory={inventory} onBuy={handleBuy} onToggle={handleToggle} busyKey={busyShopKey} />
          </div>

          <div className="space-y-5">
            <AddTaskForm onAdd={handleAddTask} />
            <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} />
          </div>
        </main>
      </div>

      <LevelUpModal level={levelUpTo} onClose={() => setLevelUpTo(null)} />

      <div aria-live="polite" className="sr-only">
        {toast}
      </div>
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#1b2430]/90 px-4 py-2 text-sm text-[#f5ebdc] shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
