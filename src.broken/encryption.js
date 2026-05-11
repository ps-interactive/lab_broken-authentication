import {
    get_user_by_username
} from "../etc.js"

export function create_jwt({
    username
}) {
    return {
        username,
        token: "4601987e805aeb50"
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