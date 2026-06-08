import { Router } from "express";
import { db, pollsTable, pollOptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { VotePollBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const polls = await db.select().from(pollsTable);
  const options = await db.select().from(pollOptionsTable);

  const result = polls.map((poll) => {
    const pollOptions = options.filter((o) => o.pollId === poll.id);
    const totalVotes = pollOptions.reduce((sum, o) => sum + o.votes, 0);
    return {
      id: poll.id,
      question: poll.question,
      options: pollOptions.map((o) => ({ id: o.id, text: o.text, votes: o.votes })),
      totalVotes,
    };
  });

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, id));
  if (!poll) return res.status(404).json({ error: "Not found" });

  const options = await db.select().from(pollOptionsTable).where(eq(pollOptionsTable.pollId, id));
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  return res.json({
    id: poll.id,
    question: poll.question,
    options: options.map((o) => ({ id: o.id, text: o.text, votes: o.votes })),
    totalVotes,
  });
});

router.post("/:id/vote", async (req, res) => {
  const pollId = parseInt(req.params.id);
  const parsed = VotePollBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });

  const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, pollId));
  if (!poll) return res.status(404).json({ error: "Poll not found" });

  const { optionId } = parsed.data;
  const options = await db.select().from(pollOptionsTable).where(eq(pollOptionsTable.pollId, pollId));
  const option = options.find((o) => o.id === optionId);
  if (!option) return res.status(400).json({ error: "Invalid option" });

  await db
    .update(pollOptionsTable)
    .set({ votes: option.votes + 1 })
    .where(eq(pollOptionsTable.id, optionId));

  const updatedOptions = await db.select().from(pollOptionsTable).where(eq(pollOptionsTable.pollId, pollId));
  const totalVotes = updatedOptions.reduce((sum, o) => sum + o.votes, 0);

  return res.json({
    id: poll.id,
    question: poll.question,
    options: updatedOptions.map((o) => ({ id: o.id, text: o.text, votes: o.votes })),
    totalVotes,
  });
});

export default router;
