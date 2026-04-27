import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import {
    get_user_by_username
} from "../etc.js"

export async function authenticate_user({
    username,
    password
}) {
    let user_data = await get_user_by_username({
        username
    })

    if (!user_data) {
        await bcrypt.hash("!", 13)
        return false
    }

    let {
        password_hash: source_password_hash,
        profile
    } = user_data

    let password_ok = await bcrypt.compare(password, source_password_hash)

    let authenticated = !!password_ok

    if (!authenticated) return false

    return true
}

export function create_jwt({
    username
}) {
    let token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    return token
}

export async function user_data_from_jwt({
    token
}) {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)

    let { username } = decoded

    let user_data = await get_user_by_username({
        username
    })

    if (!user_data) return null

    return user_data
}