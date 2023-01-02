const mongoose=require("mongoose")
const todoSchema=mongoose.Schema({
    taskname:String,
    status:String,
    tag:String,
    email:String
},{versionKey:false})


const Todomodel=mongoose.model("todo",todoSchema)

module.exports={Todomodel}
