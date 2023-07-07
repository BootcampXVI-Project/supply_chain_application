import unidecode from "unidecode";

export const convertBufferToJavasciptObject = async (buffer: Buffer) => {
	// Chuyển buffer thành chuỗi UTF-8
	const resultString = await buffer.toString("utf-8");

	// Chuyển chuỗi JSON thành đối tượng JavaScript
	return JSON.parse(resultString);
};

export const convertFullNameToUsername = (fullName: string): string => {
	// Remove diacritics from the full name
	const username = unidecode(fullName);

	// Convert to lowercase and replace spaces with underscores
	return username.toLowerCase().replace(/\s+/g, "_");
};

export const generateUserCode = (userRole: string, roleId: number): string => {
	const roleCode = userRole.slice(0, 2).toUpperCase();
	return `${roleCode}${roleId}`;
};

export const capitalizeFirstLetters = (input: string): string => {
	const words = input.split(" ");
	let result = "";

	for (const word of words) {
		if (word.length > 0) {
			result += word[0].toUpperCase();
		}
	}

	return result;
};

export const generateProductCode = (
	productName: string,
	userCode: string
): string => {
	const productCode = capitalizeFirstLetters(productName) + "-" + userCode;
	return productCode;
};
