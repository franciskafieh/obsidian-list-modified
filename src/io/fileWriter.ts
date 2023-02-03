let block = "";

export function writeBlockToLogFile() {
	block = "Hello World";
	console.log(block);
	// QUEUE
	// FIRST WRITE CREATED
	// AWAIT, THEN MODIFIED
	// FINALLY: DELETED
}
