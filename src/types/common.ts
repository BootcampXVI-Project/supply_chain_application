import { Request, Response, NextFunction } from "express";

export type RequestFunction = {
	req: Request;
	res: Response;
	next: NextFunction;
};

export type Error = {
	path: any;
	value: any;
	message: { match: (arg0: RegExp) => any[] };
	statusCode: number;
	status: string;
	stack: any;
	isOperational: boolean;
};