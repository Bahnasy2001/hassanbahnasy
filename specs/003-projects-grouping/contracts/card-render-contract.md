# Contract: Card Render Surface

**Provider**: `data/config.tsx` → `config.projects` | **Consumer**: `components/Projects.tsx`

Which fields each card tier reads, and the classes each tier uses. This is the contract that
changes in this feature, which is why it is pinned here.

## Fields read, before and after

| Field | Before | After | Notes |
|---|:--:|:--:|---|
| `title` | ✅ | ✅ | Unchanged |
| `description` | ✅ | ❌ | **No longer rendered.** Stays in the data for future case-study use |
| `summary` | ❌ | ✅ | **New** — becomes the card body (FR-011) |
| `tags[]` | ✅ | ✅ | Unchanged, in array order |
| `repoUrl` | ✅ | ✅ | Guarded; absent on 2 of 5 labs |
| `demoUrl` | ✅ | ✅ | Guarded; absent on **all 12** items today |
| `kind` | ❌ | ✅ | **New** — partitions the two groups (FR-001). Never displayed |
| `labCount` | ❌ | ✅ | **New** — rendered in prose on lab cards only (FR-009) |
| `slug`, `problem`, `approach`, `impact`, `year`, `image`, `readmeUrl`, `featured` | ❌ | ❌ | Still unread. Available for future features |

## Tier class contract

Every value below was verified present in `components/` by grep. **No value outside this table
may be introduced** (FR-006).

### Shared by both tiers — identical, unchanged

- Card shell: `bg-secondary/40 rounded-xl border border-slate-800 hover:border-accent/40 transition-all duration-300 group flex flex-col`
- Icon colour: `text-accent`
- Link buttons: `text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20`
- Tag chip: `text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20`
- Body trailing utilities: `leading-relaxed mb-6 flex-grow font-light`
- Title trailing utilities: `mb-4 group-hover:text-accent transition-colors font-display`

### Tier-specific

| Aspect | Primary (`kind: 'project'`) | Secondary (`kind: 'lab'`) |
|---|---|---|
| Grid | `grid md:grid-cols-2 lg:grid-cols-3 gap-8` | `grid md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Padding | `p-8` | `p-6` |
| Icon size | `w-10 h-10` | `w-8 h-8` |
| Title | `text-xl font-bold text-white` | `text-lg font-bold text-slate-200` |
| Body | `text-slate-400` | `text-sm text-slate-400` |
| Lab count | not rendered | `text-xs font-mono text-accent` |

### Section chrome

| Element | Classes | Status |
|---|---|---|
| Section wrapper | `py-24 bg-primary`, `id="projects"` | **unchanged** — anchor must keep working (SC-009) |
| Container | `container mx-auto px-6` | **unchanged** |
| Eyebrow `h2` | `text-accent font-mono text-xl` | **unchanged** |
| Section `h3` | `text-3xl md:text-5xl font-bold text-white font-display` | classes **unchanged**; text changes "Featured Projects" → **"Projects"** (Q1 Option C) |
| Group sub-headings | `text-2xl font-bold text-white font-display mb-8` | **new element, existing classes** |
| Group wrapper | `space-y-12` | **new element, existing class** |

## Invariants

- **INV-1**: `id="projects"` stays on the outer `<section>`. The navbar link depends on it.
- **INV-1b**: The section heading keeps its element and every styling class. Only its text
  changes, to "Projects". No phrase may appear at two heading levels.
- **INV-2**: Exactly one card implementation exists, parameterised by tier. No second card
  component, so the tiers cannot drift apart.
- **INV-3**: Every item appears in exactly one group. `kind` has only two values, so the
  partition is total — but the two rendered groups must sum to the input length.
- **INV-4**: Item order within each group matches content order (FR-013).
- **INV-5**: A group with zero items renders nothing — no sub-heading, no empty grid (FR-004).
- **INV-6**: `labCount` renders only when present and greater than zero (FR-010). Absent or
  zero renders nothing, never "undefined" or "0 hands-on labs".
- **INV-7**: Lab cards keep the shared shell, borders, hover behaviour, and tag styling. Only
  padding, icon size, title colour/size, and body size differ (FR-007), and legibility and link
  operability are preserved (FR-008).
- **INV-8**: No class outside the tables above is introduced. Verifiable by diffing the class
  inventory before and after.

## Verification

1. `git status --porcelain` shows only `components/Projects.tsx` modified.
2. `npm run build` clean.
3. Built output contains 12 card titles: 7 in the first group, 5 in the second.
4. Built output contains 5 lab-count strings, 0 on project cards.
5. Class-inventory grep over `components/` yields no colour, font, or spacing value absent from
   the pre-change inventory.
6. `#projects` anchor still resolves.
7. Visual comparison against the pre-change baseline.
