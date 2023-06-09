import FabricCAServices from "fabric-ca-client";
import { Wallet } from "fabric-network";
import { ADMIN_USER_ID, ADMIN_USER_PASSWORD } from "../constants";

export const buildCAClient = (
	ccp: Record<string, any>,
	caHostName: string
): FabricCAServices => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName];
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(
		caInfo.url,
		{ trustedRoots: caTLSCACerts, verify: false },
		caInfo.caName
	);
	return caClient;
};

export const enrollAdmin = async (
	caClient: FabricCAServices,
	wallet: Wallet,
	orgMspId: string
): Promise<void> => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(ADMIN_USER_ID);
		if (identity) {
			console.log(
				"An identity for the admin user already exists in the wallet"
			);
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({
			enrollmentID: ADMIN_USER_ID,
			enrollmentSecret: ADMIN_USER_PASSWORD
		});
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes()
			},
			mspId: orgMspId,
			type: "X.509"
		};
		await wallet.put(ADMIN_USER_ID, x509Identity);

		console.log(
			"Successfully enrolled admin user and imported it into the wallet"
		);
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

export const registerAndEnrollUser = async (
	caClient: FabricCAServices,
	wallet: Wallet,
	orgMspId: string,
	userId: string,
	affiliation: string
): Promise<void> => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(
				`An identity for the user ${userId} already exists in the wallet`
			);
			return;
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(ADMIN_USER_ID);
		if (!adminIdentity) {
			console.log(
				"An identity for the admin user does not exist in the wallet"
			);
			console.log("Enroll the admin user before retrying");
			return;
		}

		// Build a user object for authenticating with the CA
		const provider = wallet
			.getProviderRegistry()
			.getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(
			adminIdentity,
			ADMIN_USER_ID
		);

		const secret = await caClient.register(
			{
				affiliation,
				enrollmentID: userId,
				role: "client"
			},
			adminUser
		);
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes()
			},
			mspId: orgMspId,
			type: "X.509"
		};
		await wallet.put(userId, x509Identity);

		console.log(
			`Successfully registered and enrolled user ${userId} and imported it into the wallet`
		);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};
