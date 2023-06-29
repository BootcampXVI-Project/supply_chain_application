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

export const getInitials = (input: string): string => {
	const words: string[] = input.split(" ");
	const initials: string[] = [];

	for (const word of words) {
		if (word.length > 0) {
			for (const char of word) {
				if (char.match(/[A-Za-z]/) !== null) {
					initials.push(char.toUpperCase());
					break;
				}
			}
		}
	}

	return initials.join("");
};

export const generateProductCode = (
	productName: string,
	userCode: string
): string => {
	const productCode = getInitials(productName) + "-" + userCode;
	return productCode;
};
