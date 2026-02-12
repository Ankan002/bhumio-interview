# Engineering Assignments – Implementation Overview

This repository implements solutions to **four frontend engineering assignments**. The project is built with **Next.js** and organized into modular pages, one per assignment. Mock APIs simulate real-world backend inconsistencies (unreliable pagination, temporary failures, delayed responses, and divergent validation). The implementations focus on **data correctness**, **async handling**, **validation**, and **event processing** in the presence of such behavior.

**📦 Installation**

```bash
npm install
```

**🚀 Run**

```bash
npm run dev
```

---

## 1. 📄 Broken Pagination

**Route:** `/broken-pagination`

### Problem Summary

The pagination API is designed to behave inconsistently. It may:

- Return **overlapping pages**: the start index is sometimes shifted backward (by a random amount up to 5) for pages after the first, so the same items can appear on multiple pages.
- Return **fewer items** than the requested page size (random reduction by 0–5 items in about 40% of responses).
- Use **unstable ordering**: item order is randomly shuffled in about 30% of responses.
- **Lack a total count**: the API returns only a page of items; there is no total or “hasMore” field.

### Approach Implemented

The solution loads pages incrementally and maintains a single, correct list on the client:

- **Incremental loading:** Each “Load more” request fetches the next page (page 1, 2, 3, …) via `useBrokenPagination(page)`.
- **Merging:** New items from each response are appended to the existing list. Only items whose `id` is not already in the current list are added, so the list is logically merged without reordering previous items.
- **Deduplication:** A `Set` of item IDs is maintained. Incoming items are filtered so that only those with IDs not yet in the set are added; the set is updated with the new IDs. This removes duplicates from overlapping or re-ordered pages.
- **Overlapping responses:** Overlap is handled entirely by the id-based deduplication; repeated items from the API never appear twice in the UI.
- **Stopping condition:** There is no “total” from the API. When a page returns **zero items**, the client sets `isMoreData` to false and disables further “Load more” requests, preventing infinite loading.
- **Load more interaction:** The UI exposes a “Load more” button that increments the page and fetches the next page; the button is disabled when there is no more data or while a request is in progress.

### API Behavior Simulation

The `/api/broken-pagination` GET handler (with `?page=N`):

- **Overlap:** For `page > 1`, with 50% probability, reduces the start index by a random amount (0–5), then clamps to 0, so the slice can overlap with the previous page.
- **Fewer results:** With 40% probability, returns fewer than the nominal page size by slicing off a random number (0–5) of items from the end.
- **Shuffle:** With 30% probability, shuffles the slice before returning.

### Edge Cases Handled

- Overlapping pages: deduplicated by unique `id`.
- Unstable ordering: client preserves a stable merged order; new items are appended, existing order unchanged.
- Repeated items: only one instance per `id` is kept.
- Pages returning fewer items: accepted; list grows until a page returns zero items.
- End-of-data detection: empty page triggers “no more data” and disables further loading.

### Result

The UI always shows a single, duplicate-free list. Users can load more until the API returns an empty page, with no duplicates or infinite loading.

---

## 2. 📝 Eventually Consistent Form

**Route:** `/` (home)

### Problem Summary

Form submission is subject to:

- **Temporary failures:** The server may respond with 503 (Temporary failure) for a subset of requests.
- **Delayed responses:** Success may be delayed by 1–4 seconds.
- **Duplicate prevention:** Retrying or resubmitting must not create duplicate records (enforced by server using a unique constraint on email).

### Approach Implemented

- **Pending state:** On submit, the form immediately enters a pending state; the submit button shows a loading indicator and the mutation is in progress (`isPending` from `useCreateEmailForm`).
- **Automatic retries:** The create-email-form mutation uses React Query with `retry: 3`, so temporary failures (e.g. 503) trigger automatic retries without extra user action.
- **Retry limit:** At most three retries are attempted by the client; beyond that, the mutation fails and the error is surfaced.
- **Duplicate prevention:** The server rejects duplicate emails with 400 “Email already exists.” The client does not send a submission ID; idempotency is effectively ensured by the unique email constraint and the fact that a successful response means one persisted record.
- **UI states:** The form reflects the submission lifecycle: idle, pending (loading), then success (toast + form reset) or failure (error toast via the API error handler).

### API Behavior Simulation

The `/api/email-form` POST handler:

- **Random temporary failure:** With 30% probability, returns 503 “Temporary failure” without persisting.
- **Delayed success:** In another 30% band (when not failing), introduces a delay of 1–4 seconds before persisting and returning 200.
- **Success path:** Otherwise, validates input, checks for existing email, persists via MongoDB, and returns 200. Duplicate email returns 400.

### State Transitions

- **idle** → **pending** (submit clicked, mutation started).
- **pending** → **retrying** (implicit: any 503 or retriable failure causes React Query to retry while still pending).
- **pending** → **success** (server returns 200; toast and form reset).
- **pending** → **failed** (all retries exhausted or non-retriable error; error toast).

### Edge Cases Handled

- Duplicate button clicks: a single mutation is in flight; React Query’s `isPending` prevents double submission from the same trigger.
- Retry loops: capped at 3 retries to avoid unbounded retries.
- Delayed responses: user sees loading until the response arrives.
- Backend failures: 503 triggers retries; other errors (e.g. 400) are shown and do not retry indefinitely.
- Persistent submission storage: successful responses are persisted in MongoDB; duplicate email is rejected by the server.

### Result

The user sees a clear submission state (idle, loading, success, or error) and does not get duplicate records on retries or resubmits, thanks to server-side uniqueness and bounded client retries.

---

## 3. 📡 Out-of-Order Events

**Route:** `/out-of-order-events`

### Problem Summary

Events are received from a stream with:

- **Random order:** Events can arrive out of chronological order.
- **Duplicates:** The same event may be delivered more than once.
- **Late arrival:** Events may arrive after later events for the same entity have already been processed.
- **Deletions:** Once an item is deleted, it must not reappear because of an older create/update arriving later.

### Approach Implemented

The solution is documented and implemented as an **EventProcessor** (shown on the assignment page). The processor maintains correctness; the UI simply renders the processor’s state (e.g. `getActiveItems()`).

- **Incremental processing:** Each event is passed to `handleEvent(event)` as it arrives; state is updated incrementally.
- **Latest timestamp per item:** For each event `id`, the processor keeps the latest timestamp seen. If the incoming event’s timestamp is not strictly greater than this value, the event is ignored (stale or duplicate).
- **Older events ignored:** Events with `timestamp <= lastSeen` for that `id` are skipped, so late or duplicate events do not overwrite newer state.
- **Safe updates:** Only create/update/delete with the latest timestamp for an `id` are applied; create and update both set the item in the map, delete removes it.
- **Deletions:** A delete is applied only when its timestamp is the latest for that `id`; out-of-order deletes do not remove items that were re-created or updated by a newer event.

The assignment UI presents this processor design and usage (e.g. with `useRef` and `setItems(processor.getActiveItems())`); the correctness and edge cases are in the processor logic.

### Processing Logic

- **Timestamp comparison:** For each event, `lastSeen = latestTimestamp.get(id) ?? -Infinity`. If `event.timestamp <= lastSeen`, return without changing state.
- **Ignoring stale events:** Stale and duplicate events are rejected by this check.
- **Applying latest only:** After updating `latestTimestamp.set(id, timestamp)`, the event type is applied: “created”/“updated” set the item in `items`; “deleted” removes it. Thus only the latest change per `id` is reflected.

### Edge Cases Handled

- Late-arriving events: ignored if timestamp is not greater than the last seen for that `id`.
- Duplicate events: same `id` and timestamp treated as already seen and skipped.
- Update-before-create: an update (or create) with a newer timestamp creates or overwrites the item; no separate create is required first.
- Delete-after-update ordering: a delete only takes effect if its timestamp is the latest; otherwise it is ignored and the item stays.
- Infinite stream safety: state is bounded (one entry per `id` in `items` and `latestTimestamp`); processing is O(1) per event.

### Result

The processor guarantees that the set of active items (and their latest state) is correct regardless of event arrival order, duplicates, or late events. The UI can render `getActiveItems()` and always see the correct active list; deleted items do not reappear when older events arrive later.

---

## 4. ✅ Validation That Lies

**Route:** `/validation-that-lies`

### Problem Summary

- **Client and server rules can differ:** Client-side validation may allow values that the server later rejects.
- **Server may be stricter:** The server enforces rules that are not (or not fully) reflected on the client.
- **Input must persist:** User input should remain in the form after a server error so the user can correct and resubmit.
- **Client vs server errors:** Client validation errors and server validation errors are distinct; both need to be surfaced appropriately.

### Approach Implemented

- **Client validation:** The form uses Zod with `mode: "onChange"` and a schema (e.g. email format, amount as number with `refine(value => Number(value) > 10)`). Invalid input is shown inline via `FormMessage` before submit.
- **Server validation on submit:** On submit, the payload is sent to `/api/validation-lie`. The server validates with its own schema (e.g. amount `min(20)`, `max(100)`). If validation fails, the server returns 400 with an error message.
- **Separate errors:** Client errors appear as inline field messages; server errors are handled in the mutation’s catch block and shown via a toast (e.g. “Server Error” with the message), so the user can distinguish client vs server validation failures.
- **Input persistence:** The form is not reset on server error; only on success is `form.reset()` called. Values remain in the fields after a server rejection so the user can adjust and retry.
- **Dynamic rules:** Client and server schemas are defined independently (Zod on client, Zod on server), so rules can evolve on either side.

### Validation Flow

1. User types → **client validation** runs on change; errors show inline.
2. User submits → **submit** only proceeds if client validation passes (via `form.handleSubmit`).
3. Request sent to **server** → **server validation** runs (Zod parse on body).
4. **UI error handling:** Success → toast and reset. Server validation or other server error → catch block, toast with message, form values retained.

### Edge Cases Handled

- Rule changes during editing: client and server schemas can differ; server response is the source of truth for submit.
- Server stricter than client: e.g. client allows amount > 10, server requires 20–100; server rejects with a clear message and input is preserved.
- Retry submissions: user can fix values and submit again without re-entering data.
- Partial field errors: server returns a single error message (e.g. first Zod issue); shown in toast; form state remains so user can correct and resubmit.

### Result

Validation is consistent from the user’s perspective: client feedback is immediate, server feedback is clear and distinct, and user input is preserved across server rejections so validation remains usable and correct.

---

## 🏁 Final Notes

- The **mock APIs** in this project intentionally simulate unreliable or inconsistent backend behavior (broken pagination, temporary failures, delays, and divergent validation).
- The **frontend** is built to preserve correctness and a good user experience despite these conditions: deduplication and safe merging for pagination, retries and clear states for the form, a timestamp-based event processor for out-of-order events, and dual client/server validation with persistent input for “validation that lies.”
- Emphasis is on **resilience**, **data correctness**, and **clear feedback** in the presence of real-world backend inconsistencies.
