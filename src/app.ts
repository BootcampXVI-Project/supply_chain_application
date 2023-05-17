import * as path from "path";
import { Gateway } from "fabric-network";
import { buildWallet, buildCCPOrg, prettyJSONString } from "./utils/AppUtil";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";
import orgConst from "./utils/organizationConstant.json";
import { createNewUser, getAllUsers } from "./services/crudDatabase/user";
import { Product, User, UserForRegister } from "./types/models";
import { v4 as uuidv4 } from "uuid";
import { log } from "console";
import { UserModel } from "./models/UserModel";
import { Types } from "mongoose";

const channelName = "supplychain-channel";
const chaincodeName = "basic";

const walletPaths: string[] = [
	"supplierwallet",
	"manufacturerwallet",
	"distributorwallet",
	"retailerwallet",
	"consumerwallet"
];
const msps: string[] = [
	"SupplierMSP",
	"ManufacturerMSP",
	"DistributorMSP",
	"RetailerMSP",
	"ConsumerMSP"
];
const userIds: string[] = [
	"SupplierAppUserId1",
	"ManufacturerAppUserId1",
	"DistributorAppUserId1",
	"RetailerAppUserId1",
	"ConsumerAppUserId1"
];
const cas: string[] = [
	"ca.supplier.supplychain.com",
	"ca.manufacturer.supplychain.com",
	"ca.distributor.supplychain.com",
	"ca.retailer.supplychain.com",
	"ca.consumer.supplychain.com"
];
const orgs: string[] = [
	"supplier",
	"manufacturer",
	"distributor",
	"retailer",
	"consumer"
];
const pathdirs: string[] = [
	"connection-supplier.json",
	"connection-manufacturer.json",
	"connection-distributor.json",
	"connection-retailer.json",
	"connection-consumer.json"
];

export async function registerUser(userObj: UserForRegister) {
	try {
		const createdUser = await createNewUser(userObj);
		console.log(createdUser);

		const orgDetail = orgConst[userObj.Role];
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
			// userObj.UserId,
			createdUser.data.UserId,
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
		const orgDetail = orgConst[userObj.Role];
		const ccp = buildCCPOrg(orgDetail.path);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));

		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet: wallet,
			identity: userObj.UserId,
			discovery: { enabled: true, asLocalhost: true }
		});

		const network = await gateway.getNetwork(channelName);
		return network;
	} catch (error) {
		console.error(
			`connectNetwork() --> Failed to connect to the fabric network: ${error}`
		);
		throw new Error(`Failed to connect to the fabric network: ${error}`);
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

		const result = await contract.evaluateTransaction(
			funcName,
			JSON.stringify(productObj)
		);

		console.log(`\n evaluateTransaction()--> Result: committed: ${funcName}`);
		return result;
	} catch (error) {
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

async function main() {
	const userObj: UserForRegister = {
		Email: "Ryn@gmail.com",
		Password: "Ryn",
		UserName: "Ryn",
		Address: "Ryn",
		UserType: "supplier",
		Role: "supplier",
		Status: "ACTIVE"
	};

	await registerUser(userObj);
}

// main();
