import path from "path";
import orgConst from "./utils/organizationConstant.json";
import { Gateway } from "fabric-network";
import { createNewUser } from "./services/userService";
import { CHANNEL_NAME, CHAINCODE_NAME } from "./constants";
import { buildWallet, buildCCPOrg } from "./utils/AppUtil";
import { convertBufferToJavasciptObject } from "./helpers";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";
import {
	User,
	UserForRegister,
	Product,
	ProductForCultivate,
	OrderForUpdateFinish,
	OrderForCreate
} from "./types/models";

export async function registerUser(userObj: UserForRegister) {
	try {
		const createdUser = await createNewUser(userObj);

		if (createdUser.data !== null) {
			const { role, userId } = createdUser.data;
			const orgDetail = orgConst[role];
			const ccp = buildCCPOrg(orgDetail.path);
			const caClient = buildCAClient(ccp, orgDetail.ca);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

			await enrollAdmin(caClient, wallet, orgDetail.msp);
			await registerAndEnrollUser(
				caClient,
				wallet,
				orgDetail.msp,
				userId,
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
		if (userObj) {
			const orgDetail = orgConst[userObj.role];
			const ccp = buildCCPOrg(orgDetail.path);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet: wallet,
				identity: userObj.userId,
				discovery: { enabled: true, asLocalhost: true }
			});

			return await gateway.getNetwork(CHANNEL_NAME);
		} else {
			const orgDetail = orgConst["consumer"];
			const ccp = buildCCPOrg(orgDetail.path);
			const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));
			const caClient = buildCAClient(ccp, orgDetail.ca);

			await enrollAdmin(caClient, wallet, orgDetail.msp);

			const gateway = new Gateway();
			await gateway.connect(ccp, {
				wallet: wallet,
				identity: "admin",
				discovery: { enabled: true, asLocalhost: true }
			});

			return await gateway.getNetwork(CHANNEL_NAME);
		}
	} catch (error) {
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
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`submitTransaction()--> ${funcName}`);
		const data = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(productObj)
		);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}, ${error}`);
	}
}

export async function submitTransactionCultivateProduct(
	funcName: string,
	userObj: User,
	productObj: ProductForCultivate
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`submitTransaction()--> ${funcName}`);
		const data = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(productObj)
		);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}, ${error}`);
	}
}

export async function submitTransactionOrderId(
	funcName: string,
	userObj: User,
	orderId: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`submitTransaction()--> ${funcName}, ${orderId}`);
		const data = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			orderId
		);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}, ${error}`);
	}
}

export async function submitTransactionOrderObj(
	funcName: string,
	userObj: User,
	orderObj: OrderForUpdateFinish
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`submitTransaction()--> ${funcName}`);
		const data = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(orderObj)
		);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}, ${error}`);
	}
}

export async function submitTransactionCreateOrder(
	funcName: string,
	userObj: User,
	orderObj: OrderForCreate
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`submitTransaction()--> ${funcName}`);
		const data = await contract.submitTransaction(
			funcName,
			JSON.stringify(userObj),
			JSON.stringify(orderObj)
		);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}, ${error}`);
	}
}

export async function evaluateTransaction(
	funcName: string,
	userObj: User,
	productObj: Product
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const data = await contract.evaluateTransaction(
			funcName,
			productObj.productId
		);
		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}, ${error}`);
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
		const data = await contract.evaluateTransaction(funcName, productId);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}, ${error}`);
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
		const data = await contract.evaluateTransaction(
			funcName,
			longitude,
			latitude
		);
		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}, ${error}`);
	}
}

export async function evaluateTransactionGetNextCounter(
	funcName: string,
	userObj: User,
	counterName: string
) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const data = await contract.evaluateTransaction(funcName, counterName);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}, ${error}`);
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

		console.log(`\n evaluateTransaction() --> ${funcName}`);
		const data = await contract.evaluateTransaction(funcName, param);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}, ${error}`);
	}
}

export async function evaluateGetWithNoArgs(funcName: string, userObj: User) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(CHAINCODE_NAME);

		console.log(`\n evaluateTransaction() --> ${funcName}`);
		const data = await contract.evaluateTransaction(funcName);

		return await convertBufferToJavasciptObject(data);
	} catch (error) {
		throw new Error(`Failed to evaluateTransaction ${funcName}, ${error}`);
	}
}
