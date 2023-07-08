import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";

export default async function DefaultFeed() {
  const posts = await db.post.findMany({
    include: {
      subreddit: true,
      votes: true,
      author: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} data-testid="default-feed" />;
}
