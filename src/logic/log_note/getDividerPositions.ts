export function getDividerPositions(text: string[]) {
	const index = {
		created: {
			start: -1,
			end: -1,
		},
		modified: {
			start: -1,
			end: -1,
		},
		deleted: {
			start: -1,
			end: -1,
		},
	};

	let prevMatched = "";

	for (let i = 0; i < text.length; i++) {
		if (text[i].trim() === "%% LIST MODIFIED %%") {
			index.modified.start = i;
			prevMatched = "modified";
		} else if (text[i].trim() === "%% LIST CREATED %%") {
			index.created.start = i;
			prevMatched = "created";
		} else if (text[i].trim() === "%% LIST DELETED %%") {
			index.deleted.start = i;
			prevMatched = "deleted";
		} else if (text[i].trim() === "%% END %%") {
			switch (prevMatched) {
				case "created":
					index.created.end = i;
					break;
				case "modified":
					index.modified.end = i;
					break;
				case "deleted":
					index.deleted.end = i;
					break;
			}
		}
	}

	return index;
}
