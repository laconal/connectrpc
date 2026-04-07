import { postgresDB } from "../plugins/drizzle-postgres.js"
import { usersTable } from "../models/postgresql/schemas.js"
import { and, eq } from "drizzle-orm"

export const validateUser = async(data: {
    username: string, password: string
}): Promise<boolean> => {
    const check = await postgresDB.select().from(usersTable).where(
        and(
            eq(usersTable.username, data.username),
            eq(usersTable.password, data.password)
        )
    ).limit(1)
    if (check.length <= 0) return false
    return true
}

export const addUser = async(data: {
    username: string,
    email: string,
    password: string
}) => {
    const user: typeof usersTable.$inferInsert = {
        username: data.username,
        email: data.email,
        password: data.password
    }

    const result = await postgresDB.insert(usersTable).values(user).returning()
    return result[0]
}