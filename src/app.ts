import path from "path";
import orgConst from "./utils/organizationConstant.json";
import { Gateway } from "fabric-network";
import { CHANNEL_NAME, CHAINCODE_NAME } from "./constants";
import { buildWallet, buildCCPOrg } from "./utils/AppUtil";
import { Product, User, UserForRegister } from "./types/models";
import { createNewUser } from "./services/userService";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";

export async function registerUser(userObj: UserForRegister) {
	try {
		const createdUser = await createNewUser(userObj);

		if (createdUser.data !== null) {
			// role: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer"
			const orgDetail = orgConst[userObj.role];
			const ccp = buildCCPOrg(orgDetail.path);
			const caClient = buildCAClient(ccp, orgDetail.ca);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

			await enrollAdmin(caClient, wallet, orgDetail.msp);
			await registerAndEnrollUser(
				caClient,
				wallet,
				orgDetail.msp,
				createdUser.data.userId,
				orgDetail.department
			);
		}

		return createdUser;
	} catch (error) {
		console.error(`registerUser() --> Failed to register user, ${error}`);
		return {
			data: null,
			error: error.message
		};
	}
}

export async function connectNetwork(userObj: User) {
	try {
		console.log(userObj);
		if (userObj) {
			const orgDetail = orgConst[userObj.role];
			const ccp = buildCCPOrg(orgDetail.path);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

			console.log(userObj);
			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet: wallet,
				identity: userObj.userId,
				// identity: "admin",
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(CHANNEL_NAME);
			return network;
		} else {
			const orgDetail = orgConst["consumer"];
			const ccp = buildCCPOrg(orgDetail.path);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));
			const caClient = buildCAClient(ccp, orgDetail.ca);

			await enrollAdmin(caClient, wallet, orgDetail.msp);
			const gateway = new Gateway();
			console.log("co");
			await gateway.connect(ccp, {
				wallet: wallet,
				// identity: userObj.userId,
				identity: "admin",
				discovery: { enabled: true, asLocalhost: true }
			});
			console.log("nnet");

			const network = await gateway.getNetwork(CHANNEL_NAME);
			return network;
		}
	} catch (error) {
		console.error(
			`connectNetwork() --> Failed to connect fabric network: ${error}`
		);
		throw new Error(`Failed to connect fabric network: ${error}`);
	}
}

export async function contract(userObj: User) {
	const network = await connectNetwork(userObj);
	return network.getContract(CHAINCODE_NAME);
}

export async function submitTransaction(
	funcName: string,
	userObj: User,
	productObj: Product
) {
	try {
		console.log(productObj);
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

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

export async function submitTransactionOrderAddress(
	funcName: string,
	userObj: User,
	orderObj: Product,
	longitude: string,
	latitude: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		const result = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(orderObj),
			longitude,
			latitude
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
		console.log("eva",userObj);
		const network = await connectNetwork(userObj);
		console.log("eval");
		const contract = network.getContract(CHAINCODE_NAME);

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
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const result = await contract.evaluateTransaction(funcName, productId);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateTransactionLongitudeLatitude(
	funcName: string,
	userObj: User,
	longitude: string,
	latitude: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const result = await contract.evaluateTransaction(
			funcName,
			longitude,
			latitude
		);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateTransactionUserObjCounterName(
	funcName: string,
	userObj: User,
	counterName: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const result = await contract.evaluateTransaction(funcName, counterName);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateTransactionUserObjAnyParam(
	funcName: string,
	userObj: User,
	param: any
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);
		return await contract.evaluateTransaction(funcName, param);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

export async function evaluateGetTxTimestampChannel(userObj: User) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

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
