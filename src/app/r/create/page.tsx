"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/r/subreddit", payload);
      return data as string;
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) return loginToast();
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description: "Please choose a different name",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name",
            description:
              "Subreddit names must be between 3 and 21 characters long and can only contain letters, numbers, and underscores",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "There was an error.",
        description: "Could not create community. Please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: (data: string) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>

          <div className="relative grid gap-1">
            <div className="absolute left-0 w-6 inset-y-0 grid text-right items-center">
              <p className="text-sm text-zinc-300 pt-0.5">r/</p>
            </div>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant={"subtle"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={() => createCommunity()}
            isLoading={isLoading}
            disabled={input.length === 0}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
