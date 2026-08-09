# Contract: Page Metadata

**File**: `index.html` — the most constrained file in the project

## What may change

**Insertion point**: immediately after the existing `<title>` line and **before** the
`<!-- Tailwind via CDN … -->` comment. Nothing from that comment downwards may be touched
(research.md D-007).

The region above the comment currently holds only `charset`, `viewport`, and `<title>`, so confining
the diff to it makes "nothing protected was touched" checkable rather than asserted.

## Tags to add

| Tag | Value |
|---|---|
| `meta name="description"` | A one-sentence description of the portfolio: who the owner is and what they do |
| `meta property="og:title"` | Matches the page title |
| `meta property="og:description"` | Matches the meta description |
| `meta property="og:type"` | `website` |
| `meta property="og:url"` | `https://bahnasy2001.github.io/hassanbahnasy/` |
| `meta name="twitter:card"` | `summary` |
| `meta name="twitter:title"` | Matches the page title |
| `meta name="twitter:description"` | Matches the meta description |

**`twitter:card` is `summary`, not `summary_large_image`** — there is no image, and claiming a
large-image card without supplying one produces a broken-looking preview rather than a large one.

**The canonical URL is the lowercase form**, verified live in feature 001: the lowercase path returns
200 and the original mixed-case form returns 404.

## What must NOT change

| Protected | Why |
|---|---|
| `<title>` | Already names the owner and role, so not generic (FR-019) |
| The `tailwind.config` `<script>` block | Constitution Principle I names it explicitly |
| The `<style>` block | Contains body styling and the custom scrollbar |
| The Tailwind CDN `<script src>` | The site's entire styling depends on it |
| The Google Fonts `@import` | The site's typography depends on it |
| The module `<script src="/index.tsx">` | The application entry point |
| `<body>` and everything in it | Out of scope |

## Invariants

- **INV-1**: The diff of `index.html` MUST contain **only additions**, and all of them above the
  Tailwind CDN comment.
- **INV-2**: Every protected item above MUST be byte-identical after the change.
- **INV-3**: The description and title metadata MUST accurately describe this portfolio. Misleading
  preview text is worse than none (FR-021).
- **INV-4**: `og:title`/`twitter:title` MUST agree with `<title>`, and `og:description`/
  `twitter:description` MUST agree with the meta description. Divergent copies drift.
- **INV-5**: No metadata may change anything a visitor sees on the page (FR-021).
- **INV-6**: No `og:image` is added. Previews will be text-only — a real limitation, recorded rather
  than hidden.

## Verification

1. `git diff index.html` shows additions only, all above the Tailwind CDN comment.
2. The `tailwind.config` block, `<style>` block, CDN tag, and font import are unchanged in the diff.
3. `npm run build` clean; `dist/index.html` carries the new tags.
4. The rendered page is visually identical.
5. A link-preview inspector finds a title, description, type, and URL where it previously found none.
