import { Vault } from "../../src/interfaces/Vault";
import { getSingleFileWithPath } from "./fakeFiles";

export class TestVault implements Vault {
	getFileByPath(path: string) {
		return getSingleFileWithPath(path);
	}
}
