// USAGE: bun bumpVersion major OR bun bumpVersion minor OR bun bumpVersion patch [OPTIONAL: --alpha for an alpha github release]

import { readFileSync, writeFileSync } from "fs";
import { stdout } from "process";
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

const manifest = JSON.parse(
	readFileSync(
		values.alpha ? "manifest-beta.json" : "manifest.json",
		"utf-8",
	),
) as {
	version: string;
};

console.log(manifest.version);
const [currMajor, currMinor, currPatch] = manifest.version.split(".");

if (bumpType === "major") {
	manifest.version = `${parseInt(currMajor) + 1}.0.0`;
} else if (bumpType === "minor") {
	console.log(currMajor);
	console.log(currMinor);
	console.log(currPatch);
	manifest.version = `${currMajor}.${parseInt(currMinor) + 1}.0`;
} else if (bumpType === "patch") {
	manifest.version = `${currMajor}.${currMinor}.${parseInt(currPatch) + 1}`;
}

if (values.alpha) {
	writeFileSync("manifest-beta.json", JSON.stringify(manifest, null, 4));
	manifest.version = `${manifest.version}-alpha`;
} else {
	writeFileSync("manifest.json", JSON.stringify(manifest, null, 4));
}

console.log(manifest.version);

// create and push git commit and tag
(async () => {
	Bun.spawnSync(["git", "add", "."]);

	const commitCmd = [
		"git",
		"commit",
		"-m",
		`release version ${manifest.version}`,
	];
	Bun.spawnSync(commitCmd, { stdio: ["inherit", "inherit", "inherit"] });

	Bun.spawnSync(["git", "tag", manifest.version]);

	Bun.spawnSync([
		"git",
		"push",
		"--atomic",
		"origin",
		"master",
		manifest.version,
	]);
})();
