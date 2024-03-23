import { getFill } from "./getFill";

export function getFormattedFill() {
	const created = [];
	const modified = [];
	const deleted = [];

	const stub = [];
	getFill(stub, false);
}
