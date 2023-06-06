import passport from "passport";
import "./passport";

export const jwtGuard = passport.authenticate("jwt", { session: false });
