import { getServerSession } from "next-auth";
import { Post, PostVote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";

import PostVoteClient from "./PostVoteClient";

type Props = {
  postId: string;
  initialVotesSummary?: number;
  initialVote?: PostVote | null;
  getData?: () => Promise<(Post & { votes: PostVote[] }) | null>;
};

export default async function PostVoteServer({
  postId,
  initialVotesSummary,
  initialVote,
  getData,
}: Props) {
  const session = await getServerSession();

  let _votesSummary: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesSummary = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  } else {
    _votesSummary = initialVotesSummary!;
    _currentVote = initialVote?.type;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesSummary={_votesSummary}
      initialVote={_currentVote}
      data-testid="post-vote-server"
    />
  );
}
