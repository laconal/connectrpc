import type { ConnectRouter } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";
import { AuthService } from "../../gen/auth/auth_pb.js";
import { auth_register_service } from "../../services/auth-service.js";
import { validateUser } from "../../repos/auth-repos.js";
import { signJwt, type JwtPayload } from "../../middlewares/auth-jwt.js";
import { getUser as getUserDB } from "../../repos/users-repos.js"


export default (router: ConnectRouter) =>
    router.service(AuthService, {
        async register(req) {
            try {
                const user = await auth_register_service({
                    username: req.username,
                    email:    req.email,
                    password: req.password,
                });
                if (!user) throw new ConnectError("Internal error", Code.Internal)
                return {
                    id:       user.id,
                    username: user.username,
                    email:    user.email,
                };
            } catch (err) {
                if (err instanceof ConnectError) throw err;
                if ((err as Error).message === "409") {
                    throw new ConnectError("User already exists", Code.AlreadyExists);
                }
                throw new ConnectError("Internal error", Code.Internal);
            }
        },

        async login(req) {
            const user = await validateUser({username: req.username, password: req.password})
            if (!user) throw new ConnectError("Incorrect credentials", Code.Unauthenticated)
            const temp = await getUserDB({username: req.username})
            if (!temp) throw new ConnectError("Internal error", Code.Internal)
            const token = signJwt(temp as JwtPayload)

            return { token: token }
        }
        
    });