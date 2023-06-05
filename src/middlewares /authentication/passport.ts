import passport from "passport";
import pkg from "passport-jwt";
import { JWT_SECRET_KEY } from "../../constants";

const { Strategy, ExtractJwt } = pkg;

passport.use(
	new Strategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_SECRET_KEY
		},
		(payload, response) => {
			try {
				return response(null, payload);
			} catch (error) {
				response(error, false);
			}
		}
	)
);
