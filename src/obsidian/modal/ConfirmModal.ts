import { App, ButtonComponent, Modal } from "obsidian";

export class ConfirmModal extends Modal {
	constructor(app: App, content: string, onSubmit: (result: string) => void) {
		super(app);
		this.setTitle("Are you sure?");
		this.setContent(content);

		const buttonsDiv = this.contentEl.createDiv("buttons");

		buttonsDiv.style.display = "flex";
		buttonsDiv.style.flexDirection = "row";
		buttonsDiv.style.gap = "10px";
		buttonsDiv.style.justifyContent = "right";

		new ButtonComponent(buttonsDiv).setButtonText("Cancel").onClick(() => {
			this.close();
			onSubmit("no");
		});

		new ButtonComponent(buttonsDiv)
			.setButtonText("Yes, delete all")
			.setWarning()
			.onClick(() => {
				this.close();
				onSubmit("yes");
			});
	}
}
