import * as path from "path";
import { Gateway, GatewayOptions } from "fabric-network";
import { prettyJSONString, buildWallet, buildCCPOrg } from "./utils/AppUtil";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";
import orgConst from "./utils/organizationConstant.json";

import { log } from "console";
import { User } from "./utils/user";
import crypto from "crypto";
import { ContractImpl } from "fabric-network/lib/contract";

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
	"SupplierAppUserId11",
	"ManufacturerAppUserId11",
	"DistributorAppUserId11",
	"RetailerAppUserId11",
	"ConsumerAppUserId11"
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

async function main() {
	await registerUser({
		email: "Tapn@gmail.com2",
		password: "nero2",
		userName: "nero2",
		address: "nero2",
		org: "supplier",
		role: "supplier"
	});

	// const result = await evaluateTransaction("GetAllUsers", null);
	// const data = result.toString("utf-8"); // Chuyển đổi Buffer sang chuỗi UTF-8
	// console.log(prettyJSONString(data));
	// log(orgConst)
	// try {
	// 	for (let i = 0; i < 5; i++) {
	// 		const walletPath = path.join(__dirname, walletPaths[i]);
	// 		const ccp = buildCCPOrg(pathdirs[i]);
	// 		const caClient = buildCAClient(ccp, cas[i]);
	// 		const wallet = await buildWallet(walletPath);
	// 		await enrollAdmin(caClient, wallet, msps[i]);
	// 		await registerAndEnrollUser(
	// 			caClient,
	// 			wallet,
	// 			msps[i],
	// 			userIds[i],
	// 			orgs[i] + ".department"
	// 		);
	// 		const gateway = new Gateway();
	// 		const gatewayOpts: GatewayOptions = {
	// 			wallet,
	// 			identity: userIds[i],
	// 			discovery: { enabled: true, asLocalhost: true }
	// 		};
	// 		try {
	// 			await gateway.connect(ccp, gatewayOpts);
	// 			const network = await gateway.getNetwork(channelName);
	// 			const contract = network.getContract(chaincodeName);
	// 			console.log("\n--> Submit Transaction: InitLedger");
	// 			await contract.submitTransaction("InitLedger");
	// const result = await contract.evaluateTransaction("GetAllUsers");
	// const data = result.toString("utf-8"); // Chuyển đổi Buffer sang chuỗi UTF-8
	// console.log(prettyJSONString(data));
	// 			console.log("*** Result: committed");
	// 		} finally {
	// 			gateway.disconnect();
	// 		}
	// 	}
	// } catch (error) {
	// 	console.error(`******** FAILED to run the application: ${error}`);
	// 	process.exit(1);
	// }
}

main();

async function registerUser(userObj: User) {
	try {
		const orgDetail = orgConst[userObj.org];
		const ccp = buildCCPOrg(orgDetail.path);
		const caClient = buildCAClient(ccp, orgDetail.ca);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));
		await enrollAdmin(caClient, wallet, orgDetail.msp);
		await registerAndEnrollUser(
			caClient,
			wallet,
			orgDetail.msp,
			"User1",
			orgDetail.department
		);
		await submitTransaction("CreateUser", userObj);
	} catch (error) {
		console.error(
			`\nregisterUser() --> Failed to register user ${"User1"}: ${error}`
		);
		throw new Error(`Failed to register user ${"User1"}: ${error}`);
	}
}

async function connectNetwork(userObj: User) {
	try {
		const orgDetail = orgConst[userObj.org];

		const ccp = buildCCPOrg(orgDetail.path);
		const wallet = await buildWallet(orgDetail.wallet);
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: "User1",
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

async function submitTransaction(funcName: string, userObj: User) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);
		const stringObject = JSON.stringify(userObj);
		console.log(`\n submitTransaction()--> ${funcName}`);
		log("DEBUG", typeof stringObject);

		// const result = await contract.submitTransaction(funcName, stringObject);
		const result = await contract.submitTransaction(
			funcName,
			userObj.email,
			userObj.password,
			userObj.userName,
			userObj.address,
			userObj.org,
			userObj.role
		);

		console.log(`\n submitTransaction()--> Result: committed: ${funcName}`);
		return result;
	} catch (error) {
		throw new Error(`Failed to submit transaction ${funcName}`);
	}
}

async function evaluateTransaction(funcName: string, userObj: User) {
	try {
		const network = await connectNetwork(userObj);
		const contract = network.getContract(chaincodeName);
		console.log(`\n *********contract********** ${contract}`);
		const stringObject = JSON.stringify(userObj);
		console.log(`\n evaluateTransaction()--> ${funcName}`);
		const result = await contract.evaluateTransaction(funcName, stringObject);
		console.log(`\n evaluateTransaction()--> Result: committed: ${funcName}`);
		return result;
	} catch (error) {
		throw new Error(`Failed to evaluate transaction ${funcName}`);
	}
}

module.exports = {
	connectNetwork
};
