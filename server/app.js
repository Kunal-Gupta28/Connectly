require("dotenv").config()
const express = require("express");
const app = express();
const connectDB = require('./config/connectDB');
connectDB();
const cors = require("cors")
const userRouter = require('./routes/user.router')
const port = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/user',userRouter)



module.exports = app