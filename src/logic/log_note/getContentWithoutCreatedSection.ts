export function getContentWithoutCreatedSection(data: string) {
	// remove created section
	return data.replace(/%% LIST CREATED %%[\s\S]*?%% END %%/, "");
}
