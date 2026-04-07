import type { ConnectRouter } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";
import { UserService } from "../../gen/user/user_pb.js"
import { postgresDB } from "../../plugins/drizzle-postgres.js";
import { usersTable } from "../../models/postgresql/schemas.js";
import { getUser as getUserDB } from "../../repos/users-repos.js";

export default (router: ConnectRouter) =>
  router.service(UserService, {
    async getAllUsers(req) {
      try {
        const result = await postgresDB.select().from(usersTable)
        return {
            users: result.map(x => ({
                id: x.id,
                username: x.username,
                email: x.email,
                createdAt: x.createdDate!.toISOString().replace("T", " ").replace("Z", "+00")
            }))
        }
      } catch (err) {
        throw new ConnectError("Internal error", Code.Internal);
      }
    },

    async getUser(req) {
      try {
        const result = await getUserDB({id: req.id})
        if (!result) throw new ConnectError("Not found", Code.NotFound)
        return {user: result}
      } catch (err) {
        throw new ConnectError("Internal error", Code.Internal);
      }
    }
  });