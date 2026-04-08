import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import connectAuth from "./routes/auth-routes/auth.js";
import connectUser from "./routes/user-routes/user.js";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import fastifyCors from "@fastify/cors";
import { authInterceptor } from "./middlewares/connect-auth.interceptor.js";
import { z } from "zod";

// check if all env values are provided
const envSchema = z.object({
    JWT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Invalid/missing env variables:", env.error.format());
    process.exit(1);
}

// Server
const fastify = Fastify({logger: true, http2: true})

const routes = (router: any) => {
    connectAuth(router)
    connectUser(router)
}

fastify.register(fastifyConnectPlugin, {
    routes: routes,
    interceptors: [authInterceptor]
})

fastify.register(fastifyCors, {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"]
})
fastify.register(fastifyJwt, { secret: "someKey" })

fastify.get("/", function(req, rep) {
    rep.send("Server is working")
})

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})