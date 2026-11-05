/**
 * Abstimmungen ohne Backend.
 *
 * Der API-Server ist auf Vercel nicht erreichbar, deshalb zaehlt der Browser die
 * eigene Stimme lokal und merkt sie sich in localStorage. Die Zahlen sind also
 * ein persoenliches Stimmungsbild, keine geteilte Statistik - das steht auch
 * unter den Umfragen.
 */
const KEY = "greenbalance_votes_v1";

export type LocalVote = { pollId: number; optionId: number };

export function loadVotes(): LocalVote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalVote[]) : [];
  } catch {
    return [];
  }
}

export function saveVote(vote: LocalVote): LocalVote[] {
  const votes = loadVotes().filter((v) => v.pollId !== vote.pollId);
  votes.push(vote);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(votes));
  } catch {
    /* localStorage gesperrt: Stimme gilt nur bis zum Neuladen */
  }
  return votes;
}

/** Addiert die eigene Stimme auf die Optionen, ohne die Originaldaten zu veraendern. */
export function applyVotes<T extends { id: number; options: { id: number; votes: number }[]; totalVotes: number }>(
  poll: T,
  votes: LocalVote[]
): T {
  const vote = votes.find((v) => v.pollId === poll.id);
  if (!vote) return poll;
  const options = poll.options.map((option) =>
    option.id === vote.optionId ? { ...option, votes: option.votes + 1 } : option
  );
  return { ...poll, options, totalVotes: poll.totalVotes + 1 };
}
