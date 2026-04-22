import yaml from "js-yaml"
import { readdirSync, readFileSync } from "fs"

export async function get_user_by_username({
    username : input_username
}) {
    let raw = readFileSync("data-unsafe.yaml")
    let data = yaml.load(raw)

    let { 
        users
    } = data

    let user = users.find(
        user => user.username === input_username
    ) ?? null

    return user
}

//