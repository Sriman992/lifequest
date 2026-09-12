import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ATTRIBUTES, DIFFICULTY_REWARDS } from "@/lib/xp";

const VALID_ATTRS = new Set(ATTRIBUTES.map((a) => a.key));
const VALID_DIFFS = new Set(Object.keys(DIFFICULTY_REWARDS));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  // Scoped to the signed-in user only — this is the "users can only see
  // their own data" requirement, enforced at the query level.
  const [user, tasks] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ user, tasks });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);
  const title = (body?.title || "").trim();
  const notes = (body?.notes || "").trim() || null;
  const attribute = body?.attribute;
  const difficulty = body?.difficulty;

  if (!title) return NextResponse.json({ error: "A task needs a title." }, { status: 400 });
  if (title.length > 140) return NextResponse.json({ error: "Keep the title under 140 characters." }, { status: 400 });
  if (!VALID_ATTRS.has(attribute)) return NextResponse.json({ error: "Pick a valid attribute." }, { status: 400 });
  if (!VALID_DIFFS.has(difficulty)) return NextResponse.json({ error: "Pick a valid difficulty." }, { status: 400 });

  const task = await prisma.task.create({
    data: { userId, title, notes, attribute, difficulty, status: "ACTIVE" },
  });

  return NextResponse.json(task, { status: 201 });
}
