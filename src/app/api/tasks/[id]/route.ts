import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeLevel, DIFFICULTY_REWARDS, parseAttributeXp, Difficulty, AttributeKey } from "@/lib/xp";
import { updateStreak } from "@/lib/streak";

async function getOwnedTask(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) return null; // never leak whether it exists for someone else
  return task;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  const task = await getOwnedTask(userId, params.id);
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  if (body.action === "complete") {
    if (task.status === "DONE") {
      return NextResponse.json({ error: "That task is already complete." }, { status: 400 });
    }

    // All reward math happens here, server-side, from the task's own stored
    // difficulty — the client never gets to say how much XP an action is worth.
    const reward = DIFFICULTY_REWARDS[task.difficulty as Difficulty];
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const beforeLevel = computeLevel(user.xp).level;
    const newTotalXp = user.xp + reward.xp;
    const afterLevel = computeLevel(newTotalXp);

    const attrs = parseAttributeXp(user.attributeXp);
    const attrKey = task.attribute as AttributeKey;
    attrs[attrKey] = (attrs[attrKey] ?? 0) + reward.xp;

    const streak = updateStreak(user.lastActiveDate, user.currentStreak, user.longestStreak);

    const [, updatedUser] = await prisma.$transaction([
      prisma.task.update({
        where: { id: task.id },
        data: { status: "DONE", completedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: newTotalXp,
          level: afterLevel.level,
          embers: { increment: reward.embers },
          attributeXp: JSON.stringify(attrs),
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActiveDate: streak.lastActiveDate,
        },
      }),
    ]);

    return NextResponse.json({
      user: updatedUser,
      reward,
      leveledUp: afterLevel.level > beforeLevel,
      newLevel: afterLevel.level,
      streakIncreased: streak.streakIncreased,
    });
  }

  if (body.action === "reopen") {
    // Undo a completion (e.g. marked done by mistake). Rewards are NOT
    // clawed back — this just lets the task be worked on again.
    if (task.status !== "DONE") {
      return NextResponse.json({ error: "Task isn't complete yet." }, { status: 400 });
    }
    const updated = await prisma.task.update({
      where: { id: task.id },
      data: { status: "ACTIVE", completedAt: null },
    });
    return NextResponse.json({ task: updated });
  }

  // Plain edit (title/notes/attribute/difficulty) — only while still active.
  if (task.status === "DONE") {
    return NextResponse.json({ error: "Can't edit a completed task." }, { status: 400 });
  }
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim().slice(0, 140);
  if (typeof body.notes === "string") data.notes = body.notes.trim() || null;
  if (typeof body.attribute === "string") data.attribute = body.attribute;
  if (typeof body.difficulty === "string") data.difficulty = body.difficulty;

  const updated = await prisma.task.update({ where: { id: task.id }, data });
  return NextResponse.json({ task: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const userId = (session.user as any).id as string;

  const task = await getOwnedTask(userId, params.id);
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  await prisma.task.delete({ where: { id: task.id } });
  return NextResponse.json({ ok: true });
}
