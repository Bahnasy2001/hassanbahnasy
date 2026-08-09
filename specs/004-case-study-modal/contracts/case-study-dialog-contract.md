# Contract: Case Study Dialog

**Provider**: `components/CaseStudyDialog.tsx` (new) | **Consumer**: `components/Projects.tsx`

## Interface

The dialog receives the item to display and a close callback. It renders nothing when there is no
item to show, which is how "at most one open" (FR-012) is guaranteed structurally: open state is a
single "which item, if any" value, not a boolean per card.

```text
project: Project | null      // the item whose case study to show; null = closed
onClose: () => void          // invoked by all three dismissal paths
```

**Why a nullable item rather than an `isOpen` boolean**: with a boolean plus a separately-held item,
stale content can flash on reopen (spec US3 acceptance scenario 5). One value cannot disagree with
itself.

## Rendering contract

| Element | Condition | Content |
|---|---|---|
| Nothing | `project === null` | — |
| Backdrop | item present | Covers viewport, dismisses on direct click |
| Panel | item present | Contains everything below |
| Close control | always when open | Icon button, top-right |
| Title | always when open | `project.title` |
| Problem section | always when open | Label "Problem" + `project.problem` |
| Approach section | always when open | Label "Approach" + `project.approach` |
| Impact section | always when open | Label "Impact" + `project.impact` |
| Repositories block | `project.links` non-empty | Heading "Repositories" + one link per entry |

The dialog assumes its caller only opens it for items with all three case-study fields; the caller
owns that guard (contract INV-4 below).

## Class contract

**All classes below already exist in `components/` except the two marked NEW.** Occurrence counts
from a grep across `components/`.

| Element | Classes |
|---|---|
| Backdrop | `fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-6` |
| Panel | `bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative` **+ `max-h-full` (NEW) + `overflow-y-auto` (NEW)** |
| Close control | `text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20` |
| Title | `text-2xl font-bold text-white font-display mb-6` |
| Section stack | `space-y-6` |
| Section label | `text-accent font-mono text-sm mb-2` |
| Section body | `text-slate-400 leading-relaxed font-light` |
| Repositories heading | `text-accent font-mono text-sm mb-2` |
| Repository link | `text-slate-400 hover:text-accent transition-colors` |
| Body scroll lock | `overflow-hidden` on `document.body` (existing class, 3 uses) |
| Card affordance | `text-accent font-mono text-xs hover:text-accentHover transition-colors mt-4` |

**Provenance of the borrowed groups**: the panel is `About.tsx`'s panel verbatim; the backdrop's
`bg-primary/80 backdrop-blur-md` is the navbar's scrolled state; the close control is the card's
existing link-button treatment; the title is feature 003's sub-heading pattern.

**The two NEW classes are behavioural, not decorative** — a height cap and vertical scrolling. No
colour, font, or spacing value is added. **Approved by the owner 2026-08-09 (Q1, Option A).**
`cursor-pointer` was offered and declined, so the affordance signals itself by accent-colour hover.
Any third added class is a verification failure.

## Behaviour contract

- **INV-1**: Rendered through a **portal to `document.body`**. Not negotiable — cards are
  transformed by `whileHover`, which creates a stacking context that would trap the dialog and break
  both `fixed` positioning and `z-50` layering (research.md D-002).
- **INV-2**: Closes on the close control, on a click whose target **is** the backdrop element, and
  on Escape. All three independent (FR-013).
- **INV-3**: A click whose target is inside the panel MUST NOT close it. Implemented by testing the
  event target against the backdrop node, **not** by blanket `stopPropagation` (research.md D-003).
- **INV-4**: The **caller** decides whether an affordance exists, requiring all three case-study
  fields. The dialog does not re-check; the type cannot enforce it (research.md D-006).
- **INV-5**: `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the title
  element (FR-016).
- **INV-6**: On open, focus moves into the dialog. On close, focus returns to the affordance that
  opened it. While open, keyboard navigation must not reach content behind the overlay (FR-017).
- **INV-7**: The Escape listener is attached on open and removed on close — never left bound while
  closed, never stacked (research.md D-004).
- **INV-8**: `overflow-hidden` is set on `document.body` while open and removed on close **and on
  unmount**. A leaked lock leaves the page permanently unscrollable (research.md D-007).
- **INV-9**: Open and close are animated with Framer Motion's `AnimatePresence` plus an `exit`
  transition, following the pattern already used in `Navbar.tsx`. No new animation dependency
  (FR-019).
- **INV-10**: The card's repository icon button keeps its existing direct-navigation behaviour and
  MUST NOT open the dialog. Exactly one thing on the page opens a dialog.
- **INV-11**: Repository links open in a new tab, with `rel="noreferrer"`, matching the existing card
  links.

## Verification

1. `git status --porcelain` shows only the 4 permitted paths.
2. `npm run build` clean, zero warnings.
3. Built output contains 12 card titles and the strings "Read case study", "Problem", "Approach",
   "Impact", "Repositories".
4. Class-inventory diff shows **exactly two** added values, both from the NEW row above.
5. Manual: three dismissal paths independently; ≥5 inside-panel clicks that do not close; keyboard-
   only open/read/close with focus restored; mobile width with the longest case study fully
   reachable; 4 repository links each opening the right destination.
