import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import connectAuth from "./routes/auth-routes/auth.js";
import connectUser from "./routes/user-routes/user.js";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({logger: true, http2: true})

fastify.register(fastifyConnectPlugin, { 
    routes: connectAuth
})
fastify.register(fastifyConnectPlugin, {
    routes: connectUser
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