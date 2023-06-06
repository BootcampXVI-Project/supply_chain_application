export const convertBufferToJavasciptObject = async (buffer: Buffer) => {
	// Chuyển buffer thành chuỗi UTF-8
	const resultString =  await buffer.toString("utf-8");

	// Chuyển chuỗi JSON thành đối tượng JavaScript
	return JSON.parse(resultString);
};
