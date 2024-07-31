export function removeDividers(text: string): string {
	return text
		.split("\n")
		.filter(
			(line) =>
				!line.match(
					/^\s*%% (LIST CREATED|LIST MODIFIED|LIST DELETED|END) %%\s*$/,
				),
		)
		.join("\n");
}
