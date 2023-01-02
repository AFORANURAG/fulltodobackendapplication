require("dotenv").config()
const cookieParser = require("cookie-parser")
const express=require("express")
const app=express()
const {connection}=require("./config/db")
const {todoRouter}=require("./routes/todo.route")
const {userRouter}=require("./routes/user.routes")


app.use(express.json())
app.use(cookieParser())
app.use("/userauth",userRouter)
app.use("/todos",todoRouter)
app.get("/",(req,res)=>{
res.json({message:"welcome to homepage"})

})
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("connected to db successfully")
    } catch (error) {
        console.log(error)
    }
    console.log(`listening to port ${process.env.PORT}`)
})