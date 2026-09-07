import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, getStoredUser } from "@/lib/api-client";
import type { ApiComment, ApiProjectMember } from "@/types";

type Props = {
  taskId: string;
  members: ApiProjectMember[];
};

export function TaskComments({ taskId, members }: Props) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const currentUser = getStoredUser();
  const membership = members.find((member) => member.user.id === currentUser?.id);
  const canPost = membership?.role === "admin" || membership?.role === "member";

  const commentsQuery = useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => apiFetch<{ comments: ApiComment[] }>(`/api/tasks/${taskId}/comments`),
  });

  const createComment = useMutation({
    mutationFn: () =>
      apiFetch<{ comment: ApiComment }>(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: body.trim() }),
      }),
    onSuccess: () => {
      setBody("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "comment failed"),
  });

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim() || createComment.isPending) return;
    setError(null);
    createComment.mutate();
  }

  return (
    <section className="mt-6 border-t border-border pt-5" aria-label="comments">
      <h3 className="text-sm font-medium mb-3">comments</h3>

      {commentsQuery.isLoading && <p className="text-sm text-muted">loading comments…</p>}
      {commentsQuery.isError && (
        <p className="text-sm text-red-400" role="alert">
          {commentsQuery.error instanceof Error ? commentsQuery.error.message : "failed to load comments"}
        </p>
      )}
      {!commentsQuery.isLoading && !commentsQuery.isError && (
        <div className="space-y-3">
          {commentsQuery.data?.comments.length ? (
            commentsQuery.data.comments.map((comment) => (
              <article key={comment.id} className="rounded-md border border-border bg-bg px-3 py-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <time className="text-xs text-muted" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{comment.body}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted">no comments yet</p>
          )}
        </div>
      )}

      {canPost && (
        <form onSubmit={submitComment} className="mt-4">
          <label htmlFor={`comment-${taskId}`} className="sr-only">Add a comment</label>
          <textarea
            id={`comment-${taskId}`}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            placeholder="add a comment"
            className="block w-full rounded-md bg-bg border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : <span />}
            <button
              type="submit"
              disabled={!body.trim() || createComment.isPending}
              className="rounded-md bg-accent px-3 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {createComment.isPending ? "posting…" : "post comment"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}