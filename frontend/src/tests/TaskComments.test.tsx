import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TaskComments } from "@/components/TaskComments";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));
vi.mock("@/lib/api-client", () => ({
  apiFetch,
  getStoredUser: () => ({ id: "member-1", email: "member@example.com", name: "Member" }),
}));

const members = [
  {
    id: "membership-1",
    role: "member" as const,
    user: { id: "member-1", email: "member@example.com", name: "Member" },
  },
];

function renderComments(role: "member" | "viewer" = "member") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskComments
        taskId="task-1"
        members={[{ ...members[0], role }]}
      />
    </QueryClientProvider>,
  );
}

describe("<TaskComments />", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    apiFetch.mockResolvedValue({
      comments: [{
        id: "comment-1",
        body: "First comment",
        author: members[0].user,
        createdAt: "2026-09-08T12:00:00Z",
      }],
    });
  });

  it("shows comments and hides the composer for viewers", async () => {
    renderComments("viewer");
    expect(await screen.findByText("First comment")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "post comment" })).not.toBeInTheDocument();
  });

  it("lets members post a non-empty comment", async () => {
    renderComments();
    await screen.findByText("First comment");
    apiFetch.mockResolvedValueOnce({ comment: { id: "comment-2" } });
    const input = screen.getByPlaceholderText("add a comment");
    fireEvent.change(input, { target: { value: "Second comment" } });
    fireEvent.click(screen.getByRole("button", { name: "post comment" }));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith(
      "/api/tasks/task-1/comments",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ body: "Second comment" }) }),
    ));
  });
});