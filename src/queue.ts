export interface Queue<T> {
	add(promise: Promise<T>): void;
	remove(): Promise<T>;
	peek(): Promise<T>;
}

export class AsyncBlockingQueue<T> implements Queue<T> {
	queue: any[];

	constructor() {
		
	}

	add(promise: Promise<T>): void {
		new Promise((resolve, reject) =>
			this.queue.push({promise, resolve, reject})	
		)
	}

	remove(): Promise<T> {
		throw new Error("Method not implemented.");
	}

	peek(): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
