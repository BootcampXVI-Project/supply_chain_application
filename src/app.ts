import * as path from "path";
import { Gateway } from "fabric-network";
import { buildWallet, buildCCPOrg, prettyJSONString } from "./utils/AppUtil";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";
import orgConst from "./utils/organizationConstant.json";
import { createNewUser } from "./services/crudDatabase/user";
import { Product, User, UserForRegister } from "./types/models";

const channelName = "supplychain-channel";
const chaincodeName = "basic";

export async function registerUser(userObj: UserForRegister) {
	try {
		const createdUser = await createNewUser(userObj);

		console.log(userObj);
		console.log(userObj.role);

		const orgDetail = orgConst[userObj.role];

		// const orgDetail = orgConst["supplier"];
		// const orgDetail = orgConst["manufacturer"];
		// const orgDetail = orgConst["distributor"];
		// const orgDetail = orgConst["retailer"];
		// const orgDetail = orgConst["consumer"];

		const ccp = buildCCPOrg(orgDetail.path);
		const caClient = buildCAClient(ccp, orgDetail.ca);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

		await enrollAdmin(caClient, wallet, orgDetail.msp);
		await registerAndEnrollUser(
			caClient,
			wallet,
			orgDetail.msp,
			// userObj.userId,
			createdUser.data.userId,
			orgDetail.department
		);

		return createdUser.data;
	} catch (error) {
		console.error(`registerUser() --> Failed to register user, ${error}`);
		throw new Error(`Failed to register user, ${error}`);
	}
}

export async function connectNetwork(userObj: User) {
	try {
		const orgDetail = orgConst[userObj.role];
		const ccp = buildCCPOrg(orgDetail.path);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet: wallet,
			identity: userObj.userId,
			discovery: { enabled: true, asLocalhost: true }
		});

		const network = await gateway.getNetwork(channelName);
		return network;
	} catch (error) {
		console.error(
			`connectNetwork() --> Failed to connect fabric network: ${error}`
		);
		throw new Error(`Failed to connect fabric network: ${error}`);
	}
}

export async function submitTransaction(
	funcName: string,
	userObj: User,
	productObj: Product
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);

		const result = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(productObj)
		);

		console.log(`submitTransaction()--> Result: committed: ${funcName}`);
		return result;
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}`);
	}
}

export async function evaluateTransaction(
	funcName: string,
	userObj: User,
	productObj: Product
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);

		console.log(`\n *********contract********** ${contract}`);
		console.log(`\n evaluateTransaction()--> ${funcName}`);
		console.log(JSON.stringify(productObj));

		const result = await contract.evaluateTransaction(
			funcName,
			JSON.stringify(productObj)
		);

		console.log(`\n evaluateTransaction() --> Result: committed: ${funcName}`);
		return result;
	} catch (error) {
		console.log("error", error);
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateTransactionUserObjProductId(
	funcName: string,
	userObj: User,
	productId: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const result = await contract.evaluateTransaction(funcName, productId);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateGetTxTimestampChannel(userObj: User) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);

		console.log(`\n evaluateTransaction() --> "GetTxTimestampChannel"`);
		const result = await contract.evaluateTransaction(
			"GetTxTimestampChannel",
			null
		);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction GetTxTimestampChannel`);
	}
}

async function main() {}

// main();
