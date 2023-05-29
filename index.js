const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose") 
const dotenv = require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))

const PORT = process.env.PORT || 5000
//mongo db connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connected to Database"))
.catch((err)=>console.log(err))

//schema
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        unique: true,
    }
})

//
const userModel = mongoose.model("user",userSchema)

//api
app.get("/",(req,res)=>{
    res.send("Server is running")
})
app.post("/signup",(req,res)=>{
    console.log(req.body)
    const {email} = req.body
    userModel.findOne({email : email},(err,result)=>
    {
        console.log(result)
        console.log(err)
        if(result){
            res.send({message: "Email already registered",alert : false})
        }
        else{
            const data = userModel(req.body)
            const save = data.save()
            res.send({message: "Registration is Successful",alert : true})
        }
    })
})

//api login
app.post("/login",(req,res)=>{
    console.log(req.body)
    const {email} = req.body
    userModel.findOne({email : email},(err,result)=>{
        if(result){
            const dataSend = {
                username: result.username,
                email: result.email,
                
            };
            console.log(dataSend)
            res.send({message : "Login is Succesful",alert : true,data : dataSend });
        }
        else{
            res.send({message : "Email is not Registered,Please SignUp",alert : false });
        }
        
    })
})
//api new product

const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description: String
});
const productModel = mongoose.model("product",schemaProduct)


//save product in db
app.post("/uploadProduct",async(req,res)=>{
    console.log(req.body)
   const data = await productModel(req.body)
   const datasave = await data.save()
    res.send({message : "Product Uploaded"})
})

//
app.get("/product",async(req,res)=>{
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

//contact api
const schemaContact = mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    message: String
});
const contactModel = mongoose.model("contact",schemaContact)

//save contact infor in db
app.post("/send",async(req,res)=>{
    console.log(req.body)
   const data = await contactModel(req.body)
   const datasave = await data.save()
    res.send({message : "Message Sent"})
})

//
app.get("/send",async(req,res)=>{
    const data = await contactModel.find({})
    res.send(JSON.stringify(data))
})



app.listen(PORT,()=> console.log("Server is running at :" + PORT))