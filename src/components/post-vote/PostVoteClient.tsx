"use client";

import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useEffect, useState } from "react";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

type Props = {
  postId: string;
  initialVotesSummary: number;
  initialVote?: VoteType | null;
};

export default function PostVoteClient({
  postId,
  initialVotesSummary,
  initialVote,
}: Props) {
  const { loginToast } = useCustomToast();
  const [votesSummary, setVotesSummary] = useState<number>(initialVotesSummary);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch("/api/r/subreddit/post/vote", payload);
    },
    onError: (error, voteType) => {
      if (voteType === "UP") {
        setVotesSummary((prev) => prev - 1);
      } else if (voteType === "DOWN") setVotesSummary((prev) => prev + 1);
      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Your vote was not counted. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: (voteType: VoteType) => {
      if (currentVote === voteType) {
        if (voteType === "UP") {
          setVotesSummary((prev) => prev - 1);
        } else if (voteType === "DOWN") setVotesSummary((prev) => prev + 1);
        setCurrentVote(undefined);
      } else {
        if (voteType === "UP")
          setVotesSummary((prev) => prev + (currentVote ? 2 : 1));
        else if (voteType === "DOWN")
          setVotesSummary((prev) => prev - (currentVote ? 2 : 1));
        setCurrentVote(voteType);
      }
    },
  });

  return (
    <div
      className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0"
      data-testid="post-vote-client"
    >
      <Button
        onClick={() => vote("UP")}
        size={"sm"}
        variant={"ghost"}
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesSummary}
      </p>

      <Button
        onClick={() => vote("DOWN")}
        size={"sm"}
        variant={"ghost"}
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
}
