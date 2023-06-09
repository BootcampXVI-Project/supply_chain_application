// import removeDiacritics from "remove-diacritics";
// import username from "username";

export const convertBufferToJavasciptObject = async (buffer: Buffer) => {
	// Chuyển buffer thành chuỗi UTF-8
	const resultString = await buffer.toString("utf-8");

	// Chuyển chuỗi JSON thành đối tượng JavaScript
	return JSON.parse(resultString);
};

export const removeDiacritics = (str: string): string => {
	const diacriticsMap: { [key: string]: string } = {
		á: "a",
		à: "a",
		ả: "a",
		ã: "a",
		ạ: "a",
		ắ: "a",
		ằ: "a",
		ẳ: "a",
		ẵ: "a",
		ặ: "a",
		ấ: "a",
		ầ: "a",
		ẩ: "a",
		ẫ: "a",
		ậ: "a",
		é: "e",
		è: "e",
		ẻ: "e",
		ẽ: "e",
		ẹ: "e",
		ế: "e",
		ề: "e",
		ể: "e",
		ễ: "e",
		ệ: "e",
		í: "i",
		ì: "i",
		ỉ: "i",
		ĩ: "i",
		ị: "i",
		ó: "o",
		ò: "o",
		ỏ: "o",
		õ: "o",
		ọ: "o",
		ố: "o",
		ồ: "o",
		ổ: "o",
		ỗ: "o",
		ộ: "o",
		ớ: "o",
		ờ: "o",
		ở: "o",
		ỡ: "o",
		ợ: "o",
		ú: "u",
		ù: "u",
		ủ: "u",
		ũ: "u",
		ụ: "u",
		ứ: "u",
		ừ: "u",
		ử: "u",
		ữ: "u",
		ự: "u",
		ý: "y",
		ỳ: "y",
		ỷ: "y",
		ỹ: "y",
		ỵ: "y",
		đ: "d"
	};

	return str
		.replace(/[^A-Za-z0-9\s]/g, "")
		.replace(/[\s]/g, " ")
		.replace(/[^\w]/g, function (char) {
			return diacriticsMap[char] || char;
		});
};

// export const generateUserNameFromFullName = async (fullName: string) => {
// 	const englishFullName = removeDiacritics(fullName);
// 	const generatedUsername = username(englishFullName);
// 	return generatedUsername;
// };
