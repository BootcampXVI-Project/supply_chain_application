import { Wallet, Wallets } from "fabric-network";
import * as fs from "fs";
import * as path from "path";

export const buildCCPOrg = (name_path: string): Record<string, any> => {
	const ccpPath = path.resolve(__dirname, "../../configs/" + name_path);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildCCPSupplier = (): Record<string, any> => {
	const ccpPath = path.resolve(
		__dirname,
		"../../configs/connection-supplier.json"
	);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildCCPManufacturer = (): Record<string, any> => {
	const ccpPath = path.resolve(
		__dirname,
		"../../configs/connection-manufacturer.json"
	);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildCCPDistributor = (): Record<string, any> => {
	const ccpPath = path.resolve(
		__dirname,
		"../../configs/connection-distributor.json"
	);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildCCPRetailer = (): Record<string, any> => {
	const ccpPath = path.resolve(
		__dirname,
		"../../configs/connection-retailer.json"
	);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildCCPConsumer = (): Record<string, any> => {
	const ccpPath = path.resolve(
		__dirname,
		"../../configs/connection-consumer.json"
	);

	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}

	const contents = fs.readFileSync(ccpPath, "utf8");
	const ccp = JSON.parse(contents);

	return ccp;
};

export const buildWallet = async (walletPath: string): Promise<Wallet> => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet: Wallet;
	if (walletPath) {
		// remove any pre-existing wallet from prior runs
		// fs.rmSync(walletPath, { recursive: true, force: true });

		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log("Built an in memory wallet");
	}

	return wallet;
};

export const prettyJSONString = (inputString: string): string => {
	if (inputString) {
		return JSON.stringify(JSON.parse(inputString), null, 2);
	} else {
		return inputString;
	}
};
