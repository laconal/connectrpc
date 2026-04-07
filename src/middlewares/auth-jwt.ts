import jwt from "jsonwebtoken";

export type JwtPayload = {
    id: number
    username: string
    email: string
};

export const verifyJwt = (authHeader: string | undefined): JwtPayload => {
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Missing or malformed Authorization header");
    }

    const token = authHeader.slice(7);
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

export const signJwt = (payload: JwtPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};