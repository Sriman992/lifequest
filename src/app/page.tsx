import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-[#f5ebdc] sm:px-6 lg:px-8">
      <div className="ambient-orb left-[-4rem] top-8 h-56 w-56 opacity-60" aria-hidden="true" />
      <div className="ambient-orb bottom-8 right-[-2rem] h-64 w-64 opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#1d2530]/60 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8a24b]/15 text-xl shadow-[0_0_18px_rgba(232,162,75,0.2)]" aria-hidden="true">
              🪔
            </span>
            <div>
              <p className="font-display text-xl leading-none text-[#f6e8d5]">LifeQuest</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9bda8]">Cozy progress</p>
            </div>
          </div>

          <Link href="/login" className="cozy-button-secondary px-4 py-2.5 text-xs uppercase tracking-[0.14em]">
            Sign in
          </Link>
        </header>

        <section className="relative mt-8 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="mx-auto max-w-xl lg:mx-0 lg:pr-8">
            <span className="cozy-chip">
              <span aria-hidden="true">✨</span>
              Cozy productivity RPG
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[0.94] text-[#f9f1e7] sm:text-6xl lg:text-[4.3rem]">
              Turn your tasks into a room you grow.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#d7cdb5]">
              Complete real quests, earn XP, build streaks, and spend Embers on the little pieces of your late-night sanctuary.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="cozy-button min-w-[180px]">
                Start your room
              </Link>
              <Link href="/login" className="cozy-button-secondary min-w-[180px]">
                Already have one?
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#d9cdb8]">
              <span className="rounded-full border border-[#e8a24b]/30 bg-[#e8a24b]/10 px-3 py-1.5">+XP for each task</span>
              <span className="rounded-full border border-[#7c9473]/30 bg-[#7c9473]/10 px-3 py-1.5">Streaks that stick</span>
              <span className="rounded-full border border-[#c97c82]/30 bg-[#c97c82]/10 px-3 py-1.5">Embers for your room</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="room-shell min-h-[440px] p-4 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.3)]">
              <div className="room-window" aria-hidden="true">
                <div className="moon-dot">🌙</div>
              </div>

              <div className="ambient-orb left-6 top-10 h-24 w-24 opacity-50" aria-hidden="true" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4 pt-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#c8bfa8]">Night mode</p>
                    <h2 className="mt-2 font-display text-3xl text-[#f6ebdb]">Your cozy study room</h2>
                  </div>
                  <span className="rounded-full border border-[#e8a24b]/30 bg-[#e8a24b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#f5d39a]">
                    Level 5
                  </span>
                </div>

                <div className="relative mt-10 h-[260px] rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,rgba(27,33,42,0.72),rgba(43,56,68,0.9))]">
                  <div className="room-lamp" aria-hidden="true" />
                  <div className="room-table" aria-hidden="true" />
                  <div className="room-shelf" aria-hidden="true" />
                  <div className="room-plant" aria-hidden="true">🪴</div>
                  <div className="room-book" style={{ left: "28%" }}>📚</div>
                  <div className="room-book" style={{ left: "42%" }}>📖</div>
                  <div className="room-book" style={{ left: "57%" }}>📘</div>
                  <div className="room-cat" aria-hidden="true">🐈</div>
                  <div className="absolute bottom-3 left-6 text-4xl" aria-hidden="true">🪑</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-2xl border border-[#e8a24b]/20 bg-[#1f2a34]/90 px-3 py-2 text-sm text-[#f7ead8] shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
                <span className="text-[#f7c77d]">+120 XP</span>
              </div>
              <div className="rounded-2xl border border-[#7c9473]/20 bg-[#1f2a34]/90 px-3 py-2 text-sm text-[#f7ead8] shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
                <span className="text-[#a9d29d]">🔥 7 day streak</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1f2a34]/90 px-3 py-2 text-sm text-[#f7ead8] shadow-[0_12px_26px_rgba(0,0,0,0.22)]">
                <span className="text-[#f3dba6]">🪙 180 Embers</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
