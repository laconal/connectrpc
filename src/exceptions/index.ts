import type { FastifyReply, FastifyRequest } from "fastify";

export interface CustomError {
    message: number | string
    type: string
}

export interface PrismaCustomError {
    code?: string
    message?: string | number
}

export const ExceptionsHandler = (
    error: CustomError, req: FastifyRequest, res: FastifyReply
) => {
    switch (error.message) {
        case "400": return res.status(400).send({error: "Bad Request"})
        case "401": return res.status(401).send({error: "Unauthorized"})
        case "403": return res.status(403).send({error: "Forbidden"})
        case "404": return res.status(404).send({error: "Not found"})
        case "409": return res.status(409).send({error: "Conflict"})
        default: return res.status(500).send({error: "Server error"})
    }
}