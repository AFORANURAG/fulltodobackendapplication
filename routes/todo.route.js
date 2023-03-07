const {Router}=require("express")
const todoRouter=Router()
const {Todomodel}=require("../models/todo.model")
// todoRouter.get("/",(req,res)=>{
//     res.send({"message":"welcome to todorouter"})
// })

const {validator}=require("../middlewares/validator.middleware")
todoRouter.use(validator)
todoRouter.post("/createtodo",async(req,res)=>{
let {taskname,status,tag,email}=req.body

try {
    let query=Todomodel({taskname,status,tag,email})
await query.save()
res.send({"message":"todo created successfully"})
} catch (error) {
    console.log(error)
    res.send({"message":"server error",error:error.message})
}
})

//last 30 minutes for aggregation
todoRouter.patch("/updatetodo/:todoid",async(req,res)=>{
    console.log(req.params)
    let userid=req.params.todoid
    console.log(userid)
    let payload=req.body
let data=await Todomodel.findOne({_id:userid,email:payload.email})
if(data){
    try {
        let query=await Todomodel.findByIdAndUpdate(userid,payload)
        console.log(query)
        res.json({message:"todo updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({message:"todo not updated",error:error.message})
    }
}else{
    res.send({"message":"not authorised"})
}
   

})

todoRouter.delete("/deletetodo/:todoid",async(req,res)=>{
    let userid=req.params.todoid
    console.log(userid)
    let data=await Todomodel.findOne({email:req.body.email,_id:userid})
    if(data){
        try {
            let query= await Todomodel.findByIdAndDelete(userid)
            
            res.json({message:"todo deleted successfully"})
        } catch (error) {
            console.log(error)
            res.json({message:"deletion unsuccessfull",error:error.message})
        }
    }else{
        res.send({message:"not authorised"})
    }


})

todoRouter.get("/",async(req,res)=>{
    let status=req.query.status
let tag=req.query.tag
console.log(status,tag)
if(status&&tag){
    try {
        let query= await Todomodel.find({status:status,tag:tag})
    return res.json({Todo: query})
    } catch (error) {
        console.log(error)
        res.send({"message":"something went wrong",err:error.message})
    }
}else if(status=="done"||status=="pending"&&tag==undefined){
    try {
        let query= await Todomodel.find({status:status})
        return res.json({Todo: query})

    } catch (error) {
        console.log(error)
        res.send({"message":"something went wrong",err:error.message})
    }
}else{
    try {
        let query=await Todomodel.find({})
        return res.json({Todo: query})
    } catch (error) {
        console.log(error)
        res.json({message:error.message})
    }
}
   



})

todoRouter.get("/todos?status&&tag",async(req,res)=>{


})


todoRouter.get("/:todoID",async (req,res)=>{
let id=req.params.todoID
let {email}=req.body
try {
    let query=await Todomodel.find({_id:id,email:email})
   if(query){
    return  res.send(query)

   }else{
    res.send({"message":"todo does not exists"})
   }   
   
} catch (error) {
    console.log(error)
    res.send({"message":"error in getting you todo",error:error.message})
}

})


module.exports={todoRouter}