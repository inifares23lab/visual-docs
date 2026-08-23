# visual

## Activation

Named: `/visual`. Otherwise loads on its own while writing or revising anything
explanatory — a spec, a proposal, a design note, a plan, a README, learning
notes, or any page working out how something fits together. Any subject.

Off for the session: "no diagrams".

The job: an otherwise text-only document gets the one figure that carries what
the prose cannot. Not decoration. Load-bearing.

## Draw by default

Prose is the reflex. The figure is the thing that has to be chosen, so choose
it. If the text describes parts and how they relate, it wants a picture, and the
reader should meet the picture before the paragraphs.

A figure is not padding. It stands in for words rather than adding to them, so
it never spends a budget for brevity — a picture that retires three paragraphs
is the shorter document.

Two ways a figure fails. Neither is "there were too many figures."

**A list drawn as boxes is still a list.**

```text
┌──────────┐
│ Step one │
└────┬─────┘
     ▼
┌──────────┐
│ Step two │
└──────────┘
```

That is `1. Step one  2. Step two` wearing a costume — six lines to say what one
line said. The fix is not to delete the figure. It is to draw what the list
could not: what feeds step one, what happens when it fails, what the two share.

**A figure beside the prose it duplicates is worse than either alone** — the
reader reads both and diffs them. Once the figure carries something, cut the
sentences that used to.

One figure per section. Two competing figures means it is two sections.

## Pick the form

Match the *shape of the relationship*, not the subject. The table has no domain
column because it does not need one — a protein, a supply chain, and a service
mesh that share a shape get the same figure.

| The relationship                              | Form            | Medium  |
| --------------------------------------------- | --------------- | ------- |
| things, and what connects to what              | box-and-line    | ASCII   |
| an ordered exchange between actors             | sequence ladder | ASCII   |
| discrete modes, and what moves between them    | state machine   | ASCII   |
| one thing transformed in stages                | pipeline, L→R   | ASCII   |
| things resting on or containing things         | layer stack     | ASCII   |
| a whole divided into parts                     | tree            | ASCII   |
| events positioned along an axis                | timeline        | ASCII   |
| a fixed region divided into labelled slots     | field map       | ASCII   |
| magnitudes compared                            | bar row         | ASCII   |
| many nodes with no natural layout              | node graph      | Mermaid |
| positions, angles, or scale that must be true  | scale drawing   | SVG     |
| a quantity varying continuously                | plot            | SVG     |
| direction and magnitude across a space         | arrow field     | SVG     |

One form serves subjects that share nothing else. A field map is a packet
header, a memory map, a partition table, a chessboard, a stanza's meter. A
sequence ladder is an API handshake, a courtship display, a chain of filing
deadlines. Recognise the shape and the drawing is already decided.

## Pick the medium

**ASCII is exact about topology and a liar about geometry.**

It nails what-connects-to-what, in what order, inside what. It cannot express an
angle, a curve, a proportion, or a continuous value — the character grid rounds
all four to the nearest cell. Water drawn in ASCII claims 90° bonds when the
answer is 104.5°, and a truss, a cam profile, an orbit, and a stress curve all
fail the same way. That is not a rough diagram, it is a wrong one.

So the question is never the subject, it is whether the *positions* carry
meaning. Topology in ASCII. Geometry in SVG.

- **ASCII** — default. Renders in a terminal, a diff, a version-control log, a
  code comment, a chat window, and anywhere else plain text goes. No build step.
  Edit in place.
- **Mermaid** — only when the graph is genuinely too dense to hand-lay *and* the
  document is read in a renderer. Price: invisible in a terminal, invisible in a
  diff, and you cannot nudge one node.
- **SVG file** — when the truth is geometric. Hand-written, no toolchain.

Never a PNG, never a screenshot of a diagram. Not diffable, not editable, and
unreadable to whoever opens the file next.

## ASCII craft

### Ruler first

Alignment is decided before the first character, not repaired after. A misaligned
vertical is the one defect that reads as wrong at a glance, and it cannot be
nudged out — every row has to agree with every other.

1. List the anchors: every box centre, lifeline, and column edge.
2. Give each a column number, one constant pitch apart, so the arithmetic is a
   multiplication instead of a run of guesses.
3. Draft with a ruler line above the figure.
4. Draw. Every vertical, junction, and arrowhead lands on a listed number.
5. Delete the ruler.

```text
         1         2         3
1234567890123456789012345678901234
Client          Gateway         Auth
  │               │               │
  ├─ POST /order ─►               │
```

Anchors at 3, 19, 35 — pitch 16. The ruler is scaffolding and does not ship,
unless the figure is a field map, where the numbers are the point.

### Rules

1. Fence it. Bare ` ``` ` or ` ```text `. A language tag invites syntax
   highlighting that will paint your box borders as operators.
2. 72 columns for the figure body. Hard cap 100. It has to survive an 80-column
   terminal, a side-by-side diff, and a phone.
3. One charset per figure, no mixing. Box-drawing (`│ ─ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ▼ ► ●`)
   in documents. Pure ASCII (`| - + > v *`) in code comments, commit messages,
   and anything that may cross a non-UTF-8 pipe.
4. One flow direction per figure. Top→bottom for time and sequence. Left→right
   for pipelines and data flow. Never both.
5. Every box gets a noun. Every arrow gets a verb or a payload. An unlabelled
   arrow is a guess the reader has to make.
6. A box top and its bottom are the same width to the character. A vertical sits
   in the identical column on every row it crosses.
7. Legend only past three distinct symbols. Below that, label inline.
8. Hang side notes off the figure with `←`, not in a paragraph underneath.

### Before shipping a figure

```sh
awk '/^```/{f=!f;next} f' doc.md | wc -L  # widest figure line, ≤72
```

`wc -L` counts display columns. `awk length`, `grep '.\{73,\}'`, and anything
else locale-dependent count *bytes*, and every box-drawing character is three of
them — they will flag a perfectly good figure.

Then read the figure with the surrounding prose covered. If you cannot name
every box and every arrow from the figure alone, it is not finished.

## Examples

Box-and-line — services and their edges:

```text
   ┌─────────┐  HTTPS   ┌─────────┐
   │ Browser │ ───────► │  Edge   │
   └─────────┘          └────┬────┘
                             │ gRPC
                  ┌──────────┴──────────┐
                  ▼                     ▼
             ┌─────────┐           ┌─────────┐
             │  Auth   │           │ Orders  │
             └────┬────┘           └────┬────┘
                  │                     │
                  └──────────┬──────────┘
                             ▼
                        ┌─────────┐
                        │Database │
                        └─────────┘
```

Sequence ladder — order matters, so time runs down:

```text
Client          Gateway         Auth
  │               │               │
  ├─ POST /order ─►               │
  │               ├─ verify ──────►
  │               ◄── ok ─────────┤
  ◄── 201 ────────┤               │
  ▼               ▼               ▼
```

Packet field map — the wire format, bit-exact, in the RFC dialect:

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Ver  |  Type |                 Length (bytes)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           Stream ID                           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

## SVG

Hand-write it. No renderer, no dependency, no generated file to keep in sync.

- Sibling of the document it serves: `docs/protocol.md` → `docs/protocol.svg`,
  referenced `![H–O–H geometry](protocol.svg)`.
- `viewBox` and no `width`/`height` attributes, so it scales.
- Theme-aware or it is black-on-black for half your readers. A `<style>` block
  with a `prefers-color-scheme` query works even when the file is pulled in as an
  `<img>`, which is how most document renderers embed it.
- `role="img"` plus `aria-label` saying what the figure shows.
- Text no smaller than 10px in user units, or it dies at thumbnail size.
- The geometry is the whole reason you left ASCII. Compute the coordinates, do
  not eyeball them, and put the real number in the figure.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140"
     role="img" text-anchor="middle"
     aria-label="Water molecule, H–O–H bond angle 104.5 degrees">
  <style>
    :root { color: #111 }
    @media (prefers-color-scheme: dark) { :root { color: #eee } }
    line { stroke: currentColor; stroke-width: 2 }
    text { fill: currentColor; font: 13px sans-serif }
  </style>
  <line x1="120" y1="58" x2="67"  y2="99"/>
  <line x1="120" y1="58" x2="173" y2="99"/>
  <text x="120" y="48">O</text>
  <text x="67"  y="118">H</text>
  <text x="173" y="118">H</text>
  <text x="120" y="92" font-size="11">104.5°</text>
</svg>
```

Those coordinates are `dx=53, dy=41`, giving `2·atan(53/41) = 104.5°`. An ASCII
version of this figure would have claimed 90° and been quietly wrong.

## Where the figure goes

Not a list of filenames. A question about what the document is for.

| The document                                | Figure                            |
| ------------------------------------------- | --------------------------------- |
| explains how something works                | yes, one, above the detail it maps |
| argues for a change                         | before/after, if boxes move        |
| enumerates or instructs — specs, checklists, task lists, commit messages | none. A list has no topology |
| sits inside what it describes — a comment   | narrow, pure ASCII, directly above |

Above the detail, never below it. The figure is the map the reader holds while
crossing the territory. Underneath, it is a summary of a journey already made.

Where the document is also a memory aid, the figure is the recall artifact:
blank one label and ask for it back. A thing you can redraw is a thing you have.
