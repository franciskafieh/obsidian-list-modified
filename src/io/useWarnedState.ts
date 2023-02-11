type Keys = "headingsNotExisting" | "fileNotExisting";
const userWarned: {
	[K in Keys]?: boolean;
} = {};

export default function useWarnedState() {
	return userWarned;
}
