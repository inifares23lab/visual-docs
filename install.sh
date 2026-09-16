#!/bin/sh
# Install /visual into every agent CLI on this machine, from one source: VISUAL.md.
# Re-run after editing VISUAL.md. Idempotent.
set -eu

src=$(cd "$(dirname "$0")" && pwd)

# No ": " in a description — it lands in an unquoted YAML scalar.
visual_desc='Add ASCII diagrams, figures, and hand-written SVG visual aids to otherwise text-only documents, on any subject — engineering, science, business, law, music, anything whose parts relate. Matches the shape of the relationship rather than the domain, so a protein, a supply chain, and a service mesh that share a shape get the same figure. Picks the form (box-and-line, sequence ladder, state machine, pipeline, layer stack, tree, timeline, field map, bar row, scale drawing, plot, arrow field) and the medium (inline ASCII for topology, SVG when positions carry meaning — angles, curves, scale, continuous values), lays a column ruler before drawing, and ships the figure aligned, labelled, and under 72 columns. Draws by default rather than describing, puts the figure above the detail it maps, and deletes the prose it replaces. A session mode — "no diagrams" turns it off for the rest of the session, and "visual always" keeps it on in every session until "visual never" removes it. Use when writing or revising a spec, proposal, design note, plan, README, learning notes, or any page working out how something fits together.'

# emit <dest> <frontmatter> <body>
emit() {
	dest=$1
	# A symlinked dest writes back through to the repo. Drop it.
	if [ -L "$(dirname "$dest")" ]; then rm "$(dirname "$dest")"; fi
	if [ -L "$dest" ]; then rm "$dest"; fi
	mkdir -p "$(dirname "$dest")"
	{ echo '---'; printf '%s\n' "$2"; echo '---'; echo; cat "$3"; } >"$dest"
	echo "  installed $dest"
}

# install_cmd <name> <bodyfile> <desc>
install_cmd() {
	if command -v claude >/dev/null 2>&1; then
		emit "$HOME/.claude/skills/$1/SKILL.md" "name: $1
description: >
  $3" "$2"
	fi
	if command -v codex >/dev/null 2>&1; then
		emit "${CODEX_HOME:-$HOME/.codex}/skills/$1/SKILL.md" "name: $1
description: >
  $3" "$2"
	fi
	if command -v opencode >/dev/null 2>&1; then
		oc=${XDG_CONFIG_HOME:-$HOME/.config}/opencode
		emit "$HOME/.opencode/skills/$1/SKILL.md" "name: $1
description: >
  $3" "$2"
		emit "$oc/command/$1.md" "description: $3" "$2"
		# Always-on plugin, vendored as a bare file. Wiring it into opencode.json
		# belongs to the aggregator (myskills), which owns that file.
		if [ -f "$src/.opencode/plugins/$1.mjs" ]; then
			mkdir -p "$oc/vendor/$1"
			cp "$src/.opencode/plugins/$1.mjs" "$oc/vendor/$1/$1.mjs"
			echo "  vendored $oc/vendor/$1/$1.mjs"
		fi
	fi
}

install_cmd visual "$src/VISUAL.md" "$visual_desc"
