// visual — OpenCode plugin (OpenCode 2 plugin API).
//
// The skill (installed into ~/.agents/skills/visual by install.sh, with a
// legacy fallback to ~/.opencode/skills/visual) is the single source of truth;
// this file only carries the always-on mechanism, the OpenCode equivalent of a
// SessionStart hook.
//
//   • On demand   — the skill and /visual command install themselves; the mode
//                   lasts the session, and "no diagrams" turns it off.
//   • Always-on   — when the opt-in flag file exists, the full body is appended
//                   to the system prompt every turn.
//
// Opt in to always-on:   say "visual always" (the agent touches the flag file),
//                        or: touch ~/.config/opencode/.visual-always
// Opt back out:          say "visual never", or: rm ~/.config/opencode/.visual-always
//
// Ported from the v1 plugin API to the v2 API, verified against OpenCode
// 2.0.11: experimental.chat.system.transform → ctx.session.hook("context"),
// pushing a { type: "text" } block. This file is a patched copy; the pristine
// upstream version lives in vendor/upstream/visual, and the port as a patch
// series in vendor/patches/visual.

import fs from 'fs';
import os from 'os';
import path from 'path';

// install.sh shares plain skills into ~/.agents/skills (codex + opencode);
// ~/.opencode/skills/visual is the legacy location, kept as a fallback.
const skillCandidates = [
  path.join(process.env.HOME || os.homedir(), '.agents', 'skills', 'visual', 'SKILL.md'),
  path.join(os.homedir(), '.opencode', 'skills', 'visual', 'SKILL.md'),
];

const flagPath = path.join(
	process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
	'opencode',
	'.visual-always',
);

// Read SKILL.md and strip a leading YAML frontmatter block (--- ... ---).
function body() {
	for (const p of skillCandidates) {
		try {
			return fs
				.readFileSync(p, 'utf8')
				.replace(/^---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/, '')
				.replace(/(?:\r?\n)+$/, '');
		} catch (e) {
			// Try the next candidate.
		}
	}
	throw new Error('no visual SKILL.md found');
}

export default {
	id: 'visual',

	async setup(ctx) {
		await ctx.session.hook('context', (event) => {
			let on = false;
			try { on = fs.existsSync(flagPath); } catch (e) {}
			if (!on) return;

			let text;
			try { text = body(); } catch (e) { return; }

			const header =
				'VISUAL MODE ACTIVE (always-on). The ruleset below applies to every ' +
				'document you write or revise this session. "no diagrams" turns it ' +
				'off for the session; delete ' + flagPath + ' to turn always-on off for good.';
			const injected = header + '\n\n' + text;

			if (!event || !Array.isArray(event.system)) return;
			event.system.push({ type: 'text', text: injected });
		});
	},
};
