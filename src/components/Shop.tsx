"use client";

import { SHOP_CATALOG } from "@/lib/shop";

interface InventoryRow {
  itemKey: string;
  equipped: boolean;
}

interface Props {
  embers: number;
  inventory: InventoryRow[];
  onBuy: (key: string) => void;
  onToggle: (key: string) => void;
  busyKey: string | null;
}

export default function Shop({ embers, inventory, onBuy, onToggle, busyKey }: Props) {
  const owned = new Map(inventory.map((i) => [i.itemKey, i.equipped]));

  return (
    <section aria-labelledby="shop-heading" className="cozy-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#d6c7ad]">Room shop</p>
          <h3 id="shop-heading" className="mt-1 font-display text-2xl text-[#f7ebdd]">
            The Nook
          </h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a24b]/25 bg-[#e8a24b]/10 px-3 py-1.5 text-sm font-semibold text-[#f5d39e]" aria-label={`${embers} embers`}>
          <span aria-hidden="true">🔥</span>
          {embers}
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SHOP_CATALOG.map((item) => {
          const isOwned = owned.has(item.key);
          const equipped = owned.get(item.key);
          const canAfford = embers >= item.cost;
          const busy = busyKey === item.key;

          return (
            <li key={item.key} className="rounded-[22px] border border-white/10 bg-[#1d2530]/70 p-3.5 shadow-[0_10px_20px_rgba(0,0,0,0.12)]">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8a24b]/10 text-3xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="rounded-full bg-[#1a2430] px-2.5 py-1 text-[11px] font-semibold text-[#f4dca4]">
                  {item.cost === 0 ? "Starter" : `${item.cost} embers`}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-base font-semibold text-[#f7ebdd]">{item.name}</p>
                <p className="mt-1 text-sm text-[#d5c7af]">{item.description}</p>
              </div>

              {isOwned ? (
                <button
                  onClick={() => onToggle(item.key)}
                  disabled={busy}
                  className={`mt-4 w-full rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    equipped
                      ? "bg-[#7c9473] text-[#15202d]"
                      : "border border-white/10 bg-[#202a36] text-[#f4ebdc]"
                  } ${busy ? "opacity-70" : ""}`}
                >
                  {busy ? "Updating…" : equipped ? "In room" : "Put in room"}
                </button>
              ) : (
                <button
                  onClick={() => onBuy(item.key)}
                  disabled={!canAfford || busy}
                  className="mt-4 w-full rounded-full bg-[#e8a24b] px-3 py-2 text-sm font-semibold text-[#1d2430] transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? "Buying…" : "Buy"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
