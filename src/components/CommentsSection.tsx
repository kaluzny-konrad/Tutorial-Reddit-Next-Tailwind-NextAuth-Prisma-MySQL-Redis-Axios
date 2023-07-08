import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

type Props = {
  postId: string;
};

export default async function CommentsSection({ postId }: Props) {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4" data-testid="comments-section">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesSummary = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find((vote) => {
              return vote.userId === session?.user?.id;
            });

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    currentVote={topLevelCommentVote}
                    votesSummary={topLevelCommentVotesSummary}
                  />
                </div>

                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((replyComment) => {
                    const replyCommentVotesSummary = replyComment.votes.reduce(
                      (acc, vote) => {
                        if (vote.type === "UP") return acc + 1;
                        if (vote.type === "DOWN") return acc - 1;
                        return acc;
                      },
                      0
                    );

                    const replyCommentVote = replyComment.votes.find((vote) => {
                      return vote.userId === session?.user?.id;
                    });

                    return (
                      <div
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                        key={replyComment.id}
                      >
                        <PostComment
                          comment={replyComment}
                          postId={replyComment.postId}
                          currentVote={replyCommentVote}
                          votesSummary={replyCommentVotesSummary}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
