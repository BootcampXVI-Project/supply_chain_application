import { UserRole } from "./types";
import { Request, Response, NextFunction } from "express";

export type RequestMiddleware = {
	req: Request;
	res: Response;
	next: NextFunction;
};

export type TokenPayload = {
	role: UserRole;
	userId: string;
	userName: string;
	phoneNumber: string;
};

export type DecodeUser = {
	userId: string;
	role: string;
	userName: string;
	phoneNumber: string;
	iat: number;
	exp: number;
};
