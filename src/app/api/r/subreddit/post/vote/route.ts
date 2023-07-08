import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const existingVote = await db.postVote.findFirst({
      where: { postId, userId: session.user.id },
    });

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { votes: true, author: true },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.postVote.delete({
          where: {
            postId_userId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        return new Response("Vote removed", { status: 200 });
      } else {
        await db.postVote.update({
          where: { postId_userId: { postId, userId: session.user.id } },
          data: { type: voteType },
        });
      }
      const votesSummary = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesSummary > CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          id: post.id,
          title: post.title,
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${post.id}`, cachePayload);
      }

      return new Response("Vote updated", { status: 200 });
    }

    await db.postVote.create({
      data: {
        type: voteType,
        postId: postId,
        userId: session.user.id,
      },
    });

    const votesSummary = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesSummary > CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        id: post.id,
        title: post.title,
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${post.id}`, cachePayload);
    }

    return new Response("Vote created", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Inavlid request data passed", { status: 422 });

    return new Response(
      "Could not register your vote, please try again later",
      {
        status: 500,
      }
    );
  }
}
