import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: { id: subredditId },
    });

    if (!subredditExists)
      return new Response("Subreddit does not exists", { status: 404 });

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        subredditId,
      },
    });

    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit", {
        status: 409,
      });
    }

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId,
      },
    });

    return new Response(subredditId, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Inavlid request data passed", { status: 422 });

    return new Response("Could not subscribe, please try again later", {
      status: 500,
    });
  }
}
