import { useGetPolls, useVotePoll, getGetPollsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { applyVotes, loadVotes, saveVote, type LocalVote } from "@/lib/local-votes";

export default function Meinungen() {
  const { data: polls, isLoading } = useGetPolls();
  const votePoll = useVotePoll();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [votedPolls, setVotedPolls] = useState<Set<number>>(new Set());
  const [localVotes, setLocalVotes] = useState<LocalVote[]>([]);

  // Frueher abgegebene Stimmen aus dem Browser laden
  useEffect(() => {
    const saved = loadVotes();
    setLocalVotes(saved);
    setVotedPolls(new Set(saved.map((v) => v.pollId)));
  }, []);

  const handleVote = (pollId: number, optionId: number) => {
    // Ohne erreichbaren API-Server zaehlt die Stimme lokal weiter, damit die
    // Umfrage nicht wirkungslos wirkt.
    setLocalVotes(saveVote({ pollId, optionId }));
    setVotedPolls((prev) => new Set(prev).add(pollId));
    toast({
      title: "Abstimmung erfasst",
      description: "Ihre Stimme ist in diesem Browser gespeichert.",
    });

    votePoll.mutate(
      { id: pollId, data: { optionId } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetPollsQueryKey() }) }
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Meinungsbild
        </h1>
        <p className="text-muted-foreground text-lg">Aktuelle Stimmungsbilder zu kontroversen Maßnahmen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))
        ) : polls?.map((rawPoll, i) => {
          const poll = applyVotes(rawPoll, localVotes);
          const isVoted = votedPolls.has(poll.id);
          const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0) || 1; // prevent div by 0

          return (
            <motion.div 
              key={poll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader>
                  <CardTitle className="text-xl leading-tight">{poll.question}</CardTitle>
                  <CardDescription>{poll.totalVotes} Stimmen insgesamt</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {poll.options.map((option) => {
                    const percentage = Math.round((option.votes / totalVotes) * 100);
                    
                    if (isVoted) {
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-muted-foreground">{percentage}% ({option.votes})</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    }

                    return (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                        onClick={() => handleVote(poll.id, option.id)}
                        disabled={votePoll.isPending}
                      >
                        {option.text}
                      </Button>
                    );
                  })}
                  
                  {isVoted && (
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-primary font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Sie haben abgestimmt
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Hinweis: Ohne erreichbaren API-Server zählt Ihre Stimme nur in diesem Browser.
        Die angezeigten Zahlen sind ein persönliches Stimmungsbild, keine geteilte Statistik.
      </p>
    </div>
  );
}