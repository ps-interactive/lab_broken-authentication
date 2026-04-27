import readline from "readline"

let LOGIN_URL = "http://localhost:8080/login"
let DATA_URL = "http://localhost:8080/me"

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function ask(q) {
    return new Promise(res => rl.question(q, res))
}

async function on_login({
    username,
    password
}) {
    try {
        let res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        if (!res.ok) {
            console.log("login failed", res.status)
            return
        }

        let data = await res.json()
        console.log("token:", data.token)
    } catch (e) {
        console.error("login error", e.message)
    }
}

async function on_token({
    token,
    username
}) {
    try {
        let res = await fetch(DATA_URL, {
            method: "GET",
            headers: {
                token,
                username
            }
        })

        if (!res.ok) {
            console.log("request failed", res.status)
            console.info(res)
            return
        }

        let data = await res.json()
        console.log("user data:", data)
    } catch (e) {
        console.error("token error", e.message)
    }
}

async function terminal_input() {
    while (true) {
        console.log("\nSelect option:")
        console.log("[1] login")
        console.log("[2] get user information")
        console.log("[q] quit")

        let choice = await ask("> ")

        if (choice === "1") {
            let username = await ask("username: ")
            let password = await ask("password: ")

            await on_login({
                username,
                password
            })
        }

        else if (choice === "2") {
            let username = await ask("username: ")
            let token = await ask("jwt token: ")

            await on_token({
                username,
                token
            })
        }

        else if (choice === "q") {
            rl.close()
            process.exit(0)
        }

        else {
            console.log("invalid option")
        }
    }
}

terminal_input()