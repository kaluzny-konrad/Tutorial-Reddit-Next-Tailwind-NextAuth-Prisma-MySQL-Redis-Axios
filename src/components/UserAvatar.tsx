import React from "react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

export default function UserAvatar({ user, ...props }: Props) {
  return (
    <Avatar {...props} data-testid="user-avatar">
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
