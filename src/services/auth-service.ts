import { addUser } from "../repos/auth-repos.js";
import { getUser } from "../repos/users-repos.js";

export const auth_register_service = async(data: interfaceAuth) => {
    const checkUserExists = await getUser({username: data.username, email: data.email})
    console.log("chekcUserExists", checkUserExists)
    if (checkUserExists) throw new Error("409")

    return await addUser(data)
}