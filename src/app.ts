/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPSupplier, buildCCPDistributor, buildCCPManufacturer, buildCCPRetailer, buildCCPConsumer, buildWallet, prettyJSONString, buildCCPOrg } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';

const channelName = 'supplychain-channel';
const chaincodeName = 'basic';
const walletPaths: string[] = ["supplierwallet", "manufacturerwallet", "distributorwallet", "retailerwallet", "consumerwallet"];

const msps: string[] = []
const mspSupplier = "SupplierMSP"
const mspManufacturer = "ManufacturerMSP"
const mspDistributor = "DistributorMSP"
const mspRetailer = "RetailerMSP"
const mspConsumer = "ConsumerMSP"
msps.push(mspSupplier)
msps.push(mspManufacturer)
msps.push(mspDistributor)
msps.push(mspRetailer)
msps.push(mspConsumer)

const userIds: string[] = []
const supplierUserId = "SupplierAppUserId2"
const manufacturerUserId = "ManufacturerAppUserId2"
const distributorUserId = "DistributorAppUserId2"
const retailerUserId = "RetailerAppUserId2"
const consumerUserId = "ConsumerAppUserId2"
userIds.push(supplierUserId);
userIds.push(manufacturerUserId);
userIds.push(distributorUserId);
userIds.push(retailerUserId);
userIds.push(consumerUserId);

const cas: string[] = []
cas.push('ca.supplier.supplychain.com')
cas.push('ca.manufacturer.supplychain.com')
cas.push('ca.distributor.supplychain.com')
cas.push('ca.retailer.supplychain.com')
cas.push('ca.consumer.supplychain.com')

const orgs: string[] = []
orgs.push('supplier')
orgs.push('manufacturer')
orgs.push('distributor')
orgs.push('retailer')
orgs.push('consumer')

const pathdirs: string[] = []
pathdirs.push('connection-supplier.json')
pathdirs.push('connection-manufacturer.json')
pathdirs.push('connection-distributor.json')
pathdirs.push('connection-retailer.json')
pathdirs.push('connection-consumer.json')

async function main() {
    try {
        for (let i = 0; i<5; i++){
            const walletPath = path.join(__dirname, walletPaths[i]);

            const ccp = buildCCPOrg(pathdirs[i]);

            const caClient = buildCAClient(ccp, cas[i]);
            
            const wallet = await buildWallet(walletPath);

            await enrollAdmin(caClient, wallet, msps[i]);

            await registerAndEnrollUser(caClient, wallet, msps[i], userIds[i], orgs[i]+'.department');

            const gateway = new Gateway();

            const gatewayOpts: GatewayOptions = {
                wallet,
                identity: userIds[i],
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            };

            try{
                await gateway.connect(ccp, gatewayOpts);

                const network = await gateway.getNetwork(channelName);

                const contract = network.getContract(chaincodeName);

                console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                await contract.submitTransaction('InitLedger');
                console.log('*** Result: committed');
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
