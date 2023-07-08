"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "./ui/Button";

export default function CloseModal() {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      variant={"subtle"}
      onClick={() => router.back()}
      className="h-6 w-6 p-0 rounded-md"
      data-testid="close-modal"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
