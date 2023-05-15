import { body, validationResult } from "express-validator";

export const returnValidationResult = (req: Request) => {
	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg
	};
};
