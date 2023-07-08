"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  username: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
};

export default function UserAccountNav({ username, email, image }: Props) {
  return (
    <DropdownMenu data-testid="user-account-nav">
      <DropdownMenuTrigger className="flex items-center gap-2">
        <UserAvatar
          user={{
            name: username || null,
            image: image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {username && <p className="font-medium">{username}</p>}
            {email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={"/"}>Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/r/create"}>Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/settings"}>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}/sign-in` });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
