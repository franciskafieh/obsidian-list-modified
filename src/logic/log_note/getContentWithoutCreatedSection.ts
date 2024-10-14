// on combineCreatedAndModified toggle ON, AWAIT run this
export function getContentWithoutCreatedSection(data: string) {
	// remove created section
	return data.replace(/%% LIST CREATED %%[\s\S]*?%% END %%/, "");
}
