import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { username } = UsernameValidator.parse(body);

    const existedUserWithSameName = await db.user.findFirst({
      where: { username },
    });
    if (existedUserWithSameName)
      return new Response("Username already exists", { status: 409 });

    await db.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Inavlid request data passed", { status: 422 });

    return new Response("Could not update username. Please try again later.", {
      status: 500,
    });
  }
}
