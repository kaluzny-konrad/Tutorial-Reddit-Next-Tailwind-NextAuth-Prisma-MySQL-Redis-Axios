import { z } from "zod";

export const UsernameValidator = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
});

export type UsernameRequest = z.infer<typeof UsernameValidator>;
