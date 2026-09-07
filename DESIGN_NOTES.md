# Design notes

## System objectives

- Secure project/task authorization
- Reliable Airtable export with server-side API integration
- Collaboration through task comments or activity tracking
- Regression-safe test coverage

## Architectural choices to preserve

### Backend

- Keep the Django + DRF structure with project-scoped auth checks in the view layer.
- Centralize permission logic in helpers, not ad hoc checks.
- Keep the existing `Membership` role model as the source of truth for access decisions.

### Frontend

- Keep the React Router + QueryClient-based flow.
- Use the existing `apiFetch` layer for token handling and consistent error parsing.
- Extend the task detail modal or a side panel rather than creating a parallel UI path.

## Security decisions

- Server-side env variables only for Airtable credentials.
- No token storage in client-local secrets beyond the existing auth token as currently designed; evaluate stronger storage patterns in a later hardening pass.
- Authorization checks should always be based on `Membership` and task-to-project ownership.

## Integration notes

- Airtable export should run server-side with retries and idempotency keys.
- Export log/history should be persisted so repeated calls do not create duplicate records.
- Activity feed should use the same project membership permission model as task updates.

## Risks acknowledged

- The current task mutation path is under-authorized.
- The export feature is not yet implemented.
- No robust auditing or collaboration stream exists for task changes.
- Test coverage is thin in permission and integration paths.

## Submission note

This file is a planning note only. No application code is changed in this stage.
