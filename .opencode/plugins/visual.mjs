// visual — OpenCode plugin.
//
// The skill in ~/.opencode/skills/visual/SKILL.md is the single source of truth;
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

import fs from 'fs';
import os from 'os';
import path from 'path';

const skillPath = path.join(os.homedir(), '.opencode', 'skills', 'visual', 'SKILL.md');

const flagPath = path.join(
	process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'),
	'opencode',
	'.visual-always',
);

// Read SKILL.md and strip a leading YAML frontmatter block (--- ... ---).
function body() {
	return fs
		.readFileSync(skillPath, 'utf8')
		.replace(/^---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/, '')
		.replace(/(?:\r?\n)+$/, '');
}

export default async () => {
	return {
		'experimental.chat.system.transform': async (_input, output) => {
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

			if (output.system.length > 0) {
				output.system[output.system.length - 1] += '\n\n' + injected;
			} else {
				output.system.push(injected);
			}
		},
	};
};
