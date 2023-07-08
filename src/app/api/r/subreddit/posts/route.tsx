import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session?.user) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    });
    followedCommunitiesIds = followedCommunities.map(
      ({ subreddit }) => subreddit.id
    );
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get("subredditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session?.user) {
      whereClause = {
        subredditId: {
          in: followedCommunitiesIds,
        },
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: parseInt(limit) * (parseInt(page) - 1),
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Inavlid request data passed", { status: 422 });

    return new Response("Could not fetch more posts, please try again later", {
      status: 500,
    });
  }
}
