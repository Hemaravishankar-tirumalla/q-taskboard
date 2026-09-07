# Review

## Issue 1 — Broken object-level authorization
- File and line numbers: [backend/projects/views.py](backend/projects/views.py#L169-L205)
- Category: Broken object-level authorization
- Severity: Critical
- Description: `TaskDetailView.patch()` and `TaskDetailView.delete()` mutate a task by ID without verifying that the caller is a member of the task’s project or has an allowed role. Project-level routes do check membership and admin restrictions in [backend/projects/views.py](backend/projects/views.py#L57-L101), but the task-level mutation path bypasses that authorization guard.
- Recommended fix: Enforce project membership and role checks before patching or deleting a task; reuse the project membership logic already used in [backend/projects/views.py](backend/projects/views.py#L104-L166). Reject non-members and viewers with HTTP 403.
- Safe local-only curl reproduction:

  curl -sS -X PATCH "http://localhost:8000/api/tasks/<task_id>" \
    -H "Authorization: Bearer <non_member_token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"HACKED","status":"done"}'

  Example response demonstrating the bug (before fix):

  {
    "id": "<task_id>",
    "title": "HACKED",
    "status": "done",
    "project_id": "<project_id>"
  }

  Expected response after the fix:

  {
    "error": "forbidden"
  }

  HTTP status: 403

## Issue 2 — SQL injection in task search
- File and line numbers: [backend/projects/views.py](backend/projects/views.py#L104-L118)
- Category: Security vulnerability
- Severity: High
- Description: The `q` search parameter is interpolated directly into a raw SQL query. This is a classic injection risk and allows user-controlled input to alter the SQL logic instead of only filtering rows.
- Recommended fix: Replace the raw SQL with Django ORM filtering, such as `Task.objects.filter(project_id=project_id).filter(Q(title__icontains=q) | Q(description__icontains=q))`, and avoid string interpolation in database queries.

## Issue 3 — Assignee assignment is not project-scoped
- File and line numbers: [backend/projects/views.py](backend/projects/views.py#L120-L166), [backend/projects/views.py](backend/projects/views.py#L169-L191)
- Category: Data integrity problem
- Severity: Medium-High
- Description: Task creation and update accept `assigneeId` without checking whether the target user is a member of the same project. This allows tasks to be assigned to users outside the project, creating inconsistent ownership and broken accountability.
- Recommended fix: Validate that any assignee belongs to a valid membership for the same project before saving the task. Reject invalid assignee IDs with HTTP 400 or 403.

## Issue 4 — Major reliability and test coverage gap
- File and line numbers: [backend/projects/tests.py](backend/projects/tests.py#L26-L87), [backend/users/tests.py](backend/users/tests.py#L1-L58), [frontend/src/tests/schemas.test.ts](frontend/src/tests/schemas.test.ts#L1-L39), [frontend/src/tests/TaskCard.test.tsx](frontend/src/tests/TaskCard.test.tsx#L1-L38)
- Category: Reliability / testing gap
- Severity: Medium
- Description: The repository covers a few basic auth and creation flows, but it does not test the highest-risk behaviors: unauthorized task mutation, cross-project assignee validation, project admin enforcement, and the project/task detail UI flows. This leaves the critical permission paths effectively unguarded by automated regression tests.
- Recommended fix: Add backend regression tests for forbidden task update/delete and invalid assignee assignment, and add frontend tests for the project page and task detail save/delete flows.

## Verified scope note
- The findings above are limited to source-backed issues present in the repository and are not speculative.
- No secrets or tokens are included in this review.