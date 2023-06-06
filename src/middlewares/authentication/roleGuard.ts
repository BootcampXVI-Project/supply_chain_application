import { Request, Response, NextFunction } from "express";
import { UserRole, UserRoleArray } from "../../types/types";
import { TokenPayload } from "../../types/common";

// Check if the user's role is allowed
export const Roles = (...permittedRoles: (string | UserRole)[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (permittedRoles.length === 0) next();

		const user = req.user as TokenPayload;

		if (user && permittedRoles.includes(user.role)) {
			if (user && permittedRoles.map((role) => UserRoleArray.includes(role))) {
				next();
			} else {
				return res.status(403).json({
					data: null,
					message: "Denied permission!",
					error: "Forbidden"
				});
			}
		} else {
			return res.status(403).json({
				data: null,
				message: "Denied permission!",
				error: "Forbidden"
			});
		}
	};
};
