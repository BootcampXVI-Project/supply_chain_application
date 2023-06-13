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
