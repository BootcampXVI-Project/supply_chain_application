import unidecode from "unidecode";
import { UserRole } from "../types/types";
import { Actor, User } from "../types/models";

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

export const parseUserToActor = (user: User): Actor => {
	const actor: Actor = {
		email: user.email,
		userName: user.userName,
		fullName: user.fullName,
		avatar: user.avatar,
		phoneNumber: user.phoneNumber,
		address: user.address,
		role: user.role,
		userId: user.userId
	};
	return actor;
};

export const createEmptyActor = (role: UserRole) => {
	return {
		email: "",
		userName: "",
		fullName: "",
		avatar: "",
		phoneNumber: "",
		address: "",
		role: role,
		userId: ""
	};
};
