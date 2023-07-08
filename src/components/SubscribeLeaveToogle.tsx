"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/use-custom-toast";

type Props = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

export default function SubscribeLeaveToogle({
  subredditId,
  subredditName,
  isSubscribed,
}: Props) {
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/r/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) return loginToast();
      }

      return toast({
        title: "There was a problem",
        description:
          "Could not subscribe to community. Please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You have subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(
        "/api/r/subreddit/unsubscribe",
        payload
      );
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) return loginToast();
      }

      return toast({
        title: "There was a problem",
        description:
          "Could not unsubscribe from community. Please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You have unsubscribed from r/${subredditName}`,
      });
    },
  });

  return (
    <div data-testid="subscribe-leave-toggle">
      {isSubscribed ? (
        <Button
          data-testid="leave-community"
          isLoading={isUnsubLoading}
          onClick={() => unsubscribe()}
          className="w-full mt-1 mb-4"
        >
          Leave Community
        </Button>
      ) : (
        <Button
          data-testid="join-community"
          isLoading={isSubLoading}
          onClick={() => subscribe()}
          className="w-full mt-1 mb-4"
        >
          Join to Community
        </Button>
      )}
    </div>
  );
}
