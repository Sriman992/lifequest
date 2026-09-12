// --- The Nook: the shop/economy system ---
// A static catalog is enough here (items don't need their own CRUD) —
// what's persisted per-user is which itemKeys they own (InventoryItem).

export type ShopCategory = "LAMP" | "PLANT" | "PET" | "POSTER" | "DESK";

export interface ShopItem {
  key: string;
  name: string;
  category: ShopCategory;
  cost: number;
  emoji: string;
  description: string;
}

export const SHOP_CATALOG: ShopItem[] = [
  { key: "lamp-warm", name: "Warm desk lamp", category: "LAMP", cost: 0, emoji: "🪔", description: "Your starting light. Always on." },
  { key: "lamp-string", name: "Fairy lights", category: "LAMP", cost: 40, emoji: "✨", description: "A soft string of lights along the shelf." },
  { key: "plant-pothos", name: "Pothos plant", category: "PLANT", cost: 25, emoji: "🪴", description: "Hard to kill. Good company." },
  { key: "plant-bonsai", name: "Little bonsai", category: "PLANT", cost: 60, emoji: "🌳", description: "Needs patience. You have that now." },
  { key: "pet-cat", name: "Study cat", category: "PET", cost: 80, emoji: "🐈‍⬛", description: "Sits on your notebook. Non-negotiable." },
  { key: "pet-fish", name: "Fishbowl", category: "PET", cost: 45, emoji: "🐠", description: "One fish. Very calm. Watches you work." },
  { key: "poster-map", name: "Old map poster", category: "POSTER", cost: 30, emoji: "🗺️", description: "Somewhere you'll go, eventually." },
  { key: "poster-vinyl", name: "Vinyl record wall", category: "POSTER", cost: 55, emoji: "💿", description: "Lo-fi hours, on display." },
  { key: "desk-coffee", name: "Coffee mug", category: "DESK", cost: 15, emoji: "☕", description: "Always half full, somehow." },
  { key: "desk-books", name: "Book stack", category: "DESK", cost: 35, emoji: "📚", description: "Read three of these. Someday." },
];

export function getShopItem(key: string): ShopItem | undefined {
  return SHOP_CATALOG.find((i) => i.key === key);
}
