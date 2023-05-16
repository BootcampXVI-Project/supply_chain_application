export const convertBufferToJavasciptObject = (buffer: Buffer) => {
	// Chuyển buffer thành chuỗi UTF-8
	const resultString = buffer.toString("utf-8");

	// Chuyển chuỗi JSON thành đối tượng JavaScript
	const resultJson = JSON.parse(resultString);
    
	return resultJson;
};
