// USAGE: bun bumpVersion major OR bun bumpVersion minor OR bun bumpVersion patch [OPTIONAL: --alpha for an alpha github release]

import { exec, execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
	args: Bun.argv,
	options: {
		alpha: {
			type: "boolean",
		},
	},
	strict: true,
	allowPositionals: true,
});

const bumpType = positionals[positionals.length - 1].toLowerCase();

if (!["major", "minor", "patch"].includes(bumpType)) {
	console.error(
		`Invalid bump type "${bumpType}". Must be major, minor, or patch.`,
	);
	process.exit(1);
}

const manifest = JSON.parse(readFileSync("manifest.json", "utf-8"));
const [currMajor, currMinor, currPatch] = manifest.version.split(".");

if (bumpType === "major") {
	manifest.version = `${parseInt(currMajor) + 1}.0.0`;
}
if (bumpType === "minor") {
	manifest.version = `${currMajor}.${parseInt(currMinor) + 1}.0`;
}
if (bumpType === "patch") {
	manifest.version = `${currMajor}.${currMinor}.${parseInt(currPatch) + 1}`;
}

writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

if (values.alpha) {
	manifest.version = `${manifest.version}-alpha`;
}

// create git tag
Bun.spawn(["git", "tag", manifest.version], {
	onExit() {
		Bun.spawn(["git", "push", "origin", "--tags"]);
	},
});
