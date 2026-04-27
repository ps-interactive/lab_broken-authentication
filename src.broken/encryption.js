import {
    get_user_by_username
} from "../etc.js"

export function create_jwt({
    username
}) {
    return {
        username,
        token: process.env.JWT_SECRET
    }
}

export async function user_data_from_jwt({
    username,
    token
}) {
    let user_data = await get_user_by_username({
        username
    })
    return user_data

}