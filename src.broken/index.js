import express from "express"
import cors from "cors"

import { 
    get_user_by_username 
} from "../etc.js"

import { 
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
        password : request_password
    } = body

    let user_data = await get_user_by_username({
        username,
    })

    if (!user_data) {
        return res.status(404).send("No user with that username. Please try again.")
    }

    let token = await create_jwt({
        username
    })

    return res.status(200).send({
        token
    })
})

app.get("/me",async (req,res)=>{
    
    let { 
        headers,
    } = req
    
    let {
        username,
        token
    } = headers

    if (token && (token !== process.env.JWT_SECRET)) {
        return res.status(403).send("Incorrect JWT token")
    }

    let user_data = await get_user_by_username({
        username
    })

    return res.status(200).send({
        ...user_data
    })

})

app.listen(process.env.PORT, ()=>console.info(`App online, listening on ${process.env.PORT}`))