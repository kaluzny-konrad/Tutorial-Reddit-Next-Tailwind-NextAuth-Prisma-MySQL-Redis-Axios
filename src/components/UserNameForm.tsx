"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  user: Pick<User, "id" | "username">;
};

export default function UserNameForm({ user }: Props) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ username }: UsernameRequest) => {
      const payload: UsernameRequest = {
        username,
      };

      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Username already exists",
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
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your username has been updated.",
      });

      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((e) => {
        updateUsername(e);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>

          <CardContent>
            <div className="relative grid gap-1">
              <div className="absolute left-0 w-6 inset-y-0 grid text-right items-center">
                <span className="text-sm text-zinc-300 pt-0.5">u/</span>
              </div>

              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                {...register("username")}
                className="w-[400px] pl-6"
                size={32}
              />

              {errors?.username && (
                <p className="px-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button isLoading={isLoading}>Change name</Button>
          </CardFooter>
        </CardHeader>
      </Card>
    </form>
  );
}
