import * as path from "path";
import { Gateway, GatewayOptions } from "fabric-network";
import {
	buildCCPSupplier,
	buildCCPDistributor,
	buildCCPManufacturer,
	buildCCPRetailer,
	buildCCPConsumer,
	prettyJSONString,
	buildWallet,
	buildCCPOrg
} from "./utils/AppUtil";
import {
	buildCAClient,
	enrollAdmin,
	registerAndEnrollUser
} from "./utils/CAUtil";

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
	"Supplier1",
	"Manufacturer1",
	"Distributor1",
	"Retailer1",
	"Consumer1"
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
	try {
		for (let i = 0; i < 5; i++) {
			const ccp = buildCCPOrg(pathdirs[i]);
			const caClient = buildCAClient(ccp, cas[i]);
			const walletPath = path.join(__dirname, walletPaths[i]);
			const wallet = await buildWallet(walletPath);

			await enrollAdmin(caClient, wallet, msps[i]);
			await registerAndEnrollUser(
				caClient,
				wallet,
				msps[i],
				userIds[i],
				orgs[i] + ".department"
			);

			const gateway = new Gateway();
			const gatewayOpts: GatewayOptions = {
				wallet,
				identity: userIds[i],
				discovery: { enabled: true, asLocalhost: true }
			};

			try {
				await gateway.connect(ccp, gatewayOpts);
				const network = await gateway.getNetwork(channelName);
				const contract = network.getContract(chaincodeName);

				console.log("\n--> Submit Transaction: InitLedger");
				await contract.submitTransaction("InitLedger");
				console.log("*** Result: committed");
			} finally {
				gateway.disconnect();
			}
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}

main();
