# Phase 0 Research: Case Study Modal

**Date**: 2026-08-09 | **Branch**: `feat/project-popups` | **Plan**: [plan.md](./plan.md)

Phase 0 had two jobs: cost out Q1 properly instead of guessing, and find out how a dialog actually
has to be built inside this page. The second turned up a trap that would have failed on first run.

## Baseline

`npm run build` clean on this branch (003 merged as PR #4). Work section renders 12 cards in two
groups. Bundle at last measurement 298,864 B.

## Decisions

### D-001 — Q1 costs exactly two classes, both behavioural

**Decision**: Add `max-h-full` and `overflow-y-auto`. Nothing else.

**Rationale**: The spec framed Q1 as a real conflict but could not size it. A full inventory of
every utility class in `components/` settles it — the overlay vocabulary is almost entirely
present already:

| Needed for a dialog | Status |
|---|---|
| `fixed`, `z-50`, `backdrop-blur-md`, `bg-primary/80` | ✅ `Navbar.tsx` |
| `inset-0` | ✅ `About.tsx` |
| `bg-slate-900`, `border-slate-700`, `p-8`, `rounded-2xl`, `shadow-2xl` | ✅ `About.tsx` panel |
| `flex`, `items-center`, `justify-center`, `w-full`, `relative`, `p-6` | ✅ widely used |
| `max-w-2xl` | ✅ 3 uses |
| `overflow-hidden` | ✅ 3 uses — covers the body scroll lock |
| **`max-h-*`** | ❌ **zero occurrences** |
| **`overflow-y-*`** | ❌ **zero occurrences** |

So the answer to "how expensive is Option A?" is: two classes, neither of them a colour, font, or
spacing value. That reframes Q1 from a principled standoff into a very cheap decision.

`max-h-full` was chosen over `max-h-[80vh]` deliberately. An arbitrary value would introduce a
magic number that looks like a new spacing decision; `max-h-full` is a named utility that inherits
its bound from the padded backdrop container, so it adds no new measurement to the design.

**Alternatives considered**: *`max-h-[80vh]`* — works, but invents a number. *No height cap, let it
grow* — the long case study runs off a phone screen with its lower half unreachable, failing
SC-006. *Shorten content on mobile* (spec Option C) — hides owner-authored writing from a large
share of visitors.

### D-002 — The dialog MUST portal to `document.body` (a trap, not a preference)

**Decision**: Render the dialog through `createPortal(…, document.body)` from `react-dom`.

**Rationale**: This is the finding most likely to have wasted an implementation cycle. Each card is
a `motion.div` carrying `whileHover={{ y: -10 }}` (`components/Projects.tsx` line 49). Framer Motion
implements that as a CSS `transform`, and **a transformed element creates a containing block and a
stacking context**. A dialog rendered inside a card would therefore:

- be layered relative to its card, not the page — so `z-50` would not lift it above the navbar,
  which is itself `fixed w-full z-50`;
- have `fixed inset-0` resolve against the card's containing block rather than the viewport, so the
  "full-screen" backdrop would cover only the card;
- risk clipping by any ancestor overflow.

Portalling to `document.body` escapes all three at once. It also keeps `App.tsx` out of scope — no
root-level provider or mount node is needed — which matters because `App.tsx` is explicitly
excluded by FR-021.

**Alternatives considered**: *Render inside the card* — broken for the reasons above. *Render at the
section level instead of the card level* — better, but the section is still inside the page flow and
a future wrapper with a transform would silently re-break it; the portal is robust rather than
merely currently-working. *Add a mount point in `App.tsx`* — out of scope and unnecessary.

### D-003 — Backdrop dismissal must test the event target, not just stop propagation

**Decision**: The backdrop's click handler closes only when the event's target **is** the backdrop
element itself.

**Rationale**: The default mistake is putting `onClick={close}` on the backdrop and relying on the
panel to stop propagation. That works until any interactive child calls its own handler, or a
click lands on padding inside the panel, and then the dialog closes while the visitor is reading —
which is exactly the failure FR-014 and SC-004 were written to catch. Comparing target to the
backdrop node is the version that cannot leak.

**Alternatives considered**: *`stopPropagation` on the panel* — works in the simple case, fragile as
the panel gains children, and silently swallows events other handlers may want. *Close on
`mousedown` anywhere outside* — introduces a text-selection bug where dragging a selection from
inside to outside dismisses the dialog mid-read.

### D-004 — Escape handling is bound to the open state

**Decision**: Attach the `keydown` listener when the dialog opens and remove it when it closes.

**Rationale**: A listener attached once for the component's lifetime keeps running while closed and,
if the component re-mounts, stacks duplicates. Binding it to open state means at most one live
listener and none while closed. Quickstart Step 6 opens and closes repeatedly and re-tests Escape
specifically to catch a stale or duplicated listener.

### D-005 — No dialog library, no new dependency

**Decision**: Build it from `react-dom`'s portal, Framer Motion's existing `AnimatePresence`
pattern, and lucide-react icons. Install nothing.

**Rationale**: This is the strongest pull toward a new dependency in the project so far —
`@headlessui/react`, `radix-ui`, and `react-modal` all exist precisely to supply focus trapping and
dialog semantics, and reaching for one would be defensible in most codebases. Principle V requires
explicit approval plus written justification that existing tools are insufficient, and they are not
insufficient here: the portal is one import, `AnimatePresence` with an `exit` transition is
**already demonstrated in `Navbar.tsx`** for the mobile menu, and the accessibility requirements
(FR-016, FR-017) are a handful of attributes plus focus save/restore.

**What this costs**: a hand-rolled focus trap is more error-prone than a library's. That is the real
trade-off, and it is why FR-017 gets its own keyboard-only verification pass rather than being
assumed from the code.

**Alternatives considered**: all three libraries above — rejected on Principle V. *Skip focus
management* — cheaper, but strands keyboard visitors behind the overlay, and Escape support was
requested precisely because keyboard visitors matter.

### D-006 — The affordance appears on 8 cards, and the type cannot enforce the rule

**Finding**: 7 items already carry problem/approach/impact — verified as exactly the 7 `kind:
"project"` items. Adding the fields to `individual-labs-early-projects` makes **8 of 12**.

**Decision**: Implement the rule as specified — all three present — enforced by a runtime render
guard, and state the 8-card consequence prominently.

**Rationale worth being honest about**: the new `links` field is optional, and problem/approach/
impact were already optional, so **the type system cannot express "all three or none"**. In feature
002 making fields required turned a missed migration into a compile error; that lever is not
available here. Correctness therefore depends on the render guard, which is a weaker guarantee. The
plan records this as a genuine Principle III limitation rather than claiming type safety it does not
have.

**Alternatives considered**: *A discriminated union requiring all three together* — would enforce it
at compile time, but changes the shape of every existing item and contradicts the request's explicit
"add an optional field". *Show the affordance whenever any one field exists* — produces half-empty
dialogs.

### D-007 — Body scroll lock uses a class that already exists

**Decision**: Toggle `overflow-hidden` on `document.body` while open; remove on close **and on
unmount**.

**Rationale**: `overflow-hidden` already appears 3 times in `components/`, so this costs no new
class. The unmount cleanup matters: if the component unmounts while open, a permanently unscrollable
page is a severe defect — far worse than the problem being solved.

**Alternatives considered**: *No lock* — the page scrolls behind the dialog, so closing returns the
visitor somewhere else, breaking FR-015. *`position: fixed` on body* — causes a scroll-position jump
on both open and close.

## Cross-Reference: Spec Assumptions → Verification Status

| Spec assumption | Status |
|---|---|
| The affordance lands on 8 of 12 cards | ✅ Verified — 7 existing (all `project`) + 1 |
| The multi-part item's current link is a profile URL, not a repository | ✅ Verified — `https://github.com/Bahnasy2001` |
| Overlay primitives exist to reuse | ✅ Verified with counts; only 2 gaps (D-001) |
| Framer Motion can do open/close without a new dependency | ✅ Verified — `AnimatePresence` + `exit` already in `Navbar.tsx` |
| Dialog renders in the section's tree without stacking problems | ❌ **Disproven — this was wrong.** The card's `whileHover` transform creates a stacking context; a portal is required (D-002) |
| Type extension precedes data | ✅ Planned as step 2 before step 3 |
| Type safety covers the "all three" rule | ❌ **It cannot** — optional fields; runtime guard required (D-006) |
| No new dependency needed | ✅ Held under real pressure (D-005) |
| Verification is manual for interaction | ⚠️ Confirmed. Class inventory and render counts are mechanical; dismissal, focus, and mobile are not |
