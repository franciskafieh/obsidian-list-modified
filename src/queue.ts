export interface Queue<T> {
	add(t: T): void;
	remove(): Promise<T>;
	peek(): Promise<T>;
}

export class AsyncBlockingQueue<T> implements Queue<T> {
	promises: Promise<T>[];
	resolvers: T | PromiseLike<T>[];

	constructor() {}

	add(t: T): void {
	}

	remove(): Promise<T> {
		throw new Error("Method not implemented.");
	}

	peek(): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
