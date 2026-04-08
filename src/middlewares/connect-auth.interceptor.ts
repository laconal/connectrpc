import type { Interceptor } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";
import { verifyJwt } from "./auth-jwt.js";

// provide another services and its methods to skip authorization
const PUBLIC_METHODS = new Set([
    "rpc auth.AuthService.Register",
    "rpc auth.AuthService.Login"
]);

export const authInterceptor: Interceptor = (next) => async (req) => {
    if (PUBLIC_METHODS.has(req.method.toString())) {
        return await next(req);
    }

    try {
        const payload = verifyJwt(req.header.get("Authorization") ?? undefined);

        req.header.set("x-user-id", String(payload.id));
        req.header.set("x-username", payload.username);

        return await next(req);
    } catch {
        throw new ConnectError("Unauthorized", Code.Unauthenticated);
    }
};