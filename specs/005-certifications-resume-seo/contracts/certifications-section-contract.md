# Contract: Certifications Section

**Provider**: `components/Certifications.tsx` (new) | **Consumes**: `certifications` from `data/config.tsx`

## Structure

```text
<section id="certifications">          reuses Skills' wrapper, EXCEPT the background (D-005)
  └── container
      ├── centred header block         verbatim from Skills
      │   ├── eyebrow heading          "Certifications"
      │   ├── section heading          e.g. "Verified Expertise"
      │   └── supporting line
      └── grid                         Projects' shape, not Skills' (D-004)
          └── card × 7
              ├── name
              ├── issuer · year
              └── "In progress" chip   in-progress only
```

## Class contract

**Every class below was verified present in the baseline inventory of 251 tokens.** Zero additions.

| Element | Classes | Source |
|---|---|---|
| Section | `py-24 bg-primary` | Skills' `py-24`; **`bg-primary` from Projects**, not Skills' `bg-secondary/30` (D-005) |
| Container | `container mx-auto px-6` | Skills, verbatim |
| Header block | `text-center mb-16` | Skills, verbatim |
| Eyebrow | `text-accent font-mono text-xl mb-2` | Skills, verbatim |
| Heading | `text-3xl md:text-5xl font-bold text-white font-display` | Skills, verbatim |
| Supporting line | `text-slate-400 mt-4 max-w-2xl mx-auto` | Skills, verbatim |
| Grid | `grid md:grid-cols-2 lg:grid-cols-3 gap-6` | Projects' columns + Skills' `gap-6` |
| Card | `bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-accent/50 transition-all group` | Skills' card, minus its icon-centric flex classes |
| Name | `text-slate-200 font-medium font-display` | Skills' label |
| Issuer / year | `text-slate-400 text-sm font-light` | Projects' body treatment |
| **In-progress chip** | `text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10` | Projects' tag-chip shape + navbar's neutral fill |
| Link wrapper | `transition-colors` on the card, no separate link styling | existing |

**The chip deliberately does not use `text-accent`.** Accent is the site's emphasis colour; an accent
chip on an unfinished credential would read as more important than the finished ones. Neutral reads as
"secondary, not yet" without looking like an error (FR-014).

**`hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]` from Skills' card is deliberately omitted** for
unlinked cards, since a hover glow on something that cannot be clicked is a false affordance. Linked
cards may keep it.

## Behaviour contract

- **INV-1**: Renders all 7 credentials in **array order**. No sorting (FR-015 / VR-005).
- **INV-2**: A credential with `credentialUrl` renders as a link opening in a new tab with
  `rel="noreferrer"` (FR-010).
- **INV-3**: A credential **without** `credentialUrl` renders as non-interactive content — no anchor
  without an href, no dead click target, no hover affordance suggesting one (FR-011 / VR-007).
- **INV-4**: In-progress credentials show the chip; completed ones show nothing in its place. The
  minority is marked (FR-012).
- **INV-5**: `tier` is **not rendered** (research.md D-002 / VR-008). The component must still handle
  `foundational` existing in the type without breaking, even though no credential uses it (VR-009).
- **INV-6**: No credential text is hardcoded. Only the eyebrow, heading, supporting line, and the
  chip label live in the component (FR-008).
- **INV-7**: The section's anchor is `certifications`, consistent with the other sections.
- **INV-8**: No class outside the table above may be introduced.
- **INV-8b**: `tier` drives **nothing** — decision B was approved as "no expert emphasis". No border,
  colour, or size may vary by tier.

## App root contract

- **INV-9**: `App.tsx` gains **exactly one line** — `<Certifications />` between `<Skills />` and
  `<Projects />`. The other seven section elements keep their existing relative order (FR-026).
- **INV-10**: This is the first sanctioned change to the protected section order. Nothing else in
  `App.tsx` may change.

## Verification

1. Built output contains all 7 credential names and the strings "Certifications" and "In progress".
2. Built output contains 5 `credentialUrl` values; the 2 unlinked credentials contribute none.
3. Class-inventory diff shows **zero** added design values.
4. `App.tsx` diff is one added import plus one added element.
5. Manual: in-progress cards distinguishable at a glance; unlinked cards offer no click target; 7
   cards render in the table's order.
