import * as path from "path";
import { Gateway } from "fabric-network";
import { buildWallet, buildCCPOrg, prettyJSONString } from "./utils/AppUtil";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";
import orgConst from "./utils/organizationConstant.json";
import connectDatabase from "./config/connectDatabase";
import { createNewUser, getAllUsers } from "./services/crudDatabase/user";
import { Product, User } from "./types/models";
import { v4 as uuidv4 } from "uuid";
import { log } from "console";
import UserModel from "./models/User";

const channelName = "supplychain-channel";
const chaincodeName = "basic2";

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

export async function registerUser(userObj: User) {
	try {
		const createdUser = await createNewUser(userObj);
		const orgDetail = orgConst[userObj.Role];
		const ccp = buildCCPOrg(orgDetail.path);
		const caClient = buildCAClient(ccp, orgDetail.ca);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));
		const user = await UserModel.findOne({ UserId: userObj.UserId });
		await enrollAdmin(caClient, wallet, orgDetail.msp);
		await registerAndEnrollUser(
			caClient,
			wallet,
			orgDetail.msp,
			user.UserId,
			orgDetail.department
		);
		// await submitTransaction(
		// 	"CultivateProduct",
		// 	userObj,
		// 	"product1",
		// 	"123",
		// 	"abc"
		// );
	} catch (error) {
		console.error(
			`\nregisterUser() --> Failed to register user ${userObj.UserId}: ${error}`
		);
		throw new Error(`Failed to register user ${userObj.UserId}: ${error}`);
	}
}

export async function connectNetwork(userObj: User) {
	try {
		const orgDetail = orgConst[userObj.Role];

		log(1);
		const ccp = buildCCPOrg(orgDetail.path);
		log(2, ccp);
		const wallet = await buildWallet(path.join(__dirname, orgDetail.wallet));
		log(3, wallet);
		const gateway = new Gateway();
		log(4, gateway);
		await gateway.connect(ccp, {
			wallet: wallet,
			identity: userObj.UserId,
			// identity: "UserId100",
			discovery: { enabled: true, asLocalhost: true }
		});
		log(5, gateway);
		const network = await gateway.getNetwork(channelName);
		log(6);
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

		console.log(
			`\n submitTransaction()--> Result: committed: ${funcName} + ${result}`
		);

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
		// const stringObject = JSON.stringify(userObj);

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

async function main() {
	const userObj: User = {
		UserId: "d53acf48-8769-4a07-a23a-d18055603f1e", //uuidv4(),
		Email: "Parker@gmail.com",
		Password: "Parker",
		UserName: "Parker",
		Address: "Parker",
		UserType: "supplier",
		Role: "supplier",
		Status: "UN-ACTIVE"
	};

	const productObj: Product = {
		ProductId: "P004",
		ProductName: "Gạo nếp",
		Dates: {
			Cultivated: "2023-01-02", // supplier
			Harvested: "",
			Imported: "", // manufacturer
			Manufacturered: "",
			Exported: "",
			Distributed: "", // distributor
			Sold: "" // retailer
		},
		Actors: {
			SupplierId: "d53acf48-8769-4a07-a23a-d18055603f1e",
			ManufacturerId: "",
			DistributorId: "",
			RetailerId: ""
		},
		Price: "150 USD",
		Status: "Available",
		Description: "Gạo nếp đạt chuẩn"
	};
	// await registerUser(userObj);
	await submitTransaction("CultivateProduct", userObj, productObj);

	const result = await evaluateTransaction("GetAllProducts", userObj, null);
	const resultString = result.toString("utf-8"); // Chuyển buffer thành chuỗi UTF-8
	const resultJson = JSON.parse(resultString); // Chuyển chuỗi JSON thành đối tượng JavaScript
	console.log(resultJson);
}

// main();
