import { Request, Response, NextFunction } from "express";

export type RequestFunction = {
	req: Request;
	res: Response;
	next: NextFunction;
};
