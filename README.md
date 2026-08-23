# visual-docs

`/visual` — put the one figure a text document is missing into it.

```sh
./install.sh
```

Idempotent. Re-run after editing `VISUAL.md`, which is the single source — the
installer adds the frontmatter each tool expects.

## What it is for

Some things are cheaper to see than to read: an architecture, a call sequence, a
wire format, a bond angle, a field of forces, a chain of filing deadlines. Any
subject — the skill matches the *shape of the relationship*, not the domain, so a
protein, a supply chain, and a service mesh that share a shape get the same
figure.

## The three rules that matter

**Draw by default.** Prose is the reflex; the figure is what has to be chosen.
If the text describes parts and how they relate, it wants a picture, and the
reader should meet the picture before the paragraphs. A figure that replaces
three paragraphs is the shortest diff, not the longest.

**ASCII is exact about topology and a liar about geometry.** It nails
what-connects-to-what. It cannot express an angle, a curve, or a proportion —
the character grid rounds all three. Water drawn in ASCII claims 90° bonds; the
answer is 104.5°. So the test is never the subject, it is whether the positions
carry meaning. Topology inline as ASCII, geometry in a hand-written SVG beside
the document. Never a PNG — not diffable, not editable, unreadable to the next
agent.

**Ruler first.** Pick the column number of every box centre and vertical before
typing a character, one constant pitch apart. Misalignment reads as wrong at a
glance and cannot be nudged out afterwards.

## Activation

Loads on its own while writing a spec, proposal, design note, plan, README, or
learning notes. Name it with `/visual`. Off for a session with "no diagrams".

