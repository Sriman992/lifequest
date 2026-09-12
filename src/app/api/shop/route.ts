import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SHOP_CATALOG, getShopItem } from "@/lib/shop";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  const inventory = await prisma.inventoryItem.findMany({ where: { userId } });
  return NextResponse.json({ catalog: SHOP_CATALOG, inventory });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const key = body?.key as string | undefined;
  const action = body?.action as "buy" | "toggle" | undefined;
  const item = key ? getShopItem(key) : undefined;
  if (!item || !action) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  if (action === "buy") {
    const already = await prisma.inventoryItem.findUnique({
      where: { userId_itemKey: { userId, itemKey: key! } },
    });
    if (already) return NextResponse.json({ error: "You already own that." }, { status: 400 });

    // The cost check happens against the DB value of embers, server-side —
    // a user can't buy something they can't afford by racing requests or
    // editing client state, since this is a single transaction.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found.");
      if (user.embers < item.cost) throw new Error("Not enough embers for that yet.");

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { embers: { decrement: item.cost } },
      });
      const inventoryItem = await tx.inventoryItem.create({
        data: { userId, itemKey: key!, equipped: true },
      });
      return { updatedUser, inventoryItem };
    }).catch((e: Error) => ({ error: e.message }));

    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result, { status: 201 });
  }

  if (action === "toggle") {
    const owned = await prisma.inventoryItem.findUnique({
      where: { userId_itemKey: { userId, itemKey: key! } },
    });
    if (!owned) return NextResponse.json({ error: "You don't own that yet." }, { status: 400 });

    const updated = await prisma.inventoryItem.update({
      where: { userId_itemKey: { userId, itemKey: key! } },
      data: { equipped: !owned.equipped },
    });
    return NextResponse.json({ inventoryItem: updated });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
