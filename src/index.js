import express from "express"
import cors from "cors"

import { 
    get_user_by_username 
} from "../etc.js"

import { 
    authenticate_user,
    create_jwt,
    user_data_from_jwt
 } from "./encryption.js"

let app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post("/login",async (req,res)=>{

    let {
        body
    } = req

    let { 
        username, 
        password 
    } = body
    let authenticated = await authenticate_user({
        username,
        password
    })

    if (!authenticated) {
        /**
         * It is sensible to be intentionally vague
         * when handling this type of error.
         */
        return res.status(403).send()
    }

    let token = await create_jwt({
        username
    })

    return res.status(200).send({
        token
    })
})

app.get("/me",async (req,res)=>{

    try {

        let { 
            headers
        } = req
    
        let {
            token,
            username
        } = headers
    
        let user_data = await user_data_from_jwt({
            token,
            username
        })
    
        if (!user_data) {
            return res.status(404).send()
        }
    
        /**
         * Destructure the user data before sending it.
         * Avoid sending raw user data to the client.
         */
        let {
            joined
        } = user_data
    
        return res.status(200).send({
            username,
            joined
        })

    } catch (e) {
        res.status(403).send()
    }
    

})

app.listen(process.env.PORT, ()=>console.info(`App online, listening on ${process.env.PORT}`))
