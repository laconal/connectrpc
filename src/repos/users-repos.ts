import { postgresDB } from "../plugins/drizzle-postgres.js";
import { usersTable } from "../models/postgresql/schemas.js";
import { eq, getTableColumns, or } from "drizzle-orm"

const { password, ...safeColumns } = getTableColumns(usersTable)
// remove safeColunms in select() to get column 'password' in response too


export const getAllUsers = async() => {
    const result = await postgresDB.select(safeColumns).from(usersTable)
    return result
}



/**
 * Finds user by its id, username or email. At least one param has to be provided
 * @param id - number, optional
 * @param username - string, optional
 * @param email - string, optional
 * @returns dictionary if found, null if not
 */
export const getUser = async(fields: {
    id?: number,
    username?: string,
    email?: string
}) => {
    if (!fields.id && !fields.username && !fields.email) return null
    const user = await postgresDB.select(safeColumns).from(usersTable)
        .where(
            or(
                ...(fields.id ? [eq(usersTable.id, fields.id)]: []),
                ...(fields.username ? [eq(usersTable.username, fields.username)] : []),
                ...(fields.email ? [eq(usersTable.email, fields.email)] : [])
            )
        ).limit(1)
    return user[0] ?? null
}