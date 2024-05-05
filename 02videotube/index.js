import express from "express"
import cors from "cors"
import multer from "multer"
import { v4 as uuidv4 } from 'uuid'

import path from 'path'

const app = express()

// multer Middleware

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads")
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname) )
   },
})

// Multer config

const upload = multer({
   storage: storage
})


//cors
app.use(
   cors({
      origin: ["http://localhost:8000", "http://localhost:5173"],
      credentials: true
   })
)

// Type of content for frontend

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*")
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   )
   next()
})

// Middleware -to 

app.use(express.json()) // Allows to add json type data
app.use(express.urlencoded({ extended: true })) // Data that we receiving from url 

// location to serve static file
app.use("./uploads", express.static("uploads"))


app.get('/', function(req, res) {
   res.json({message: 'Hello Code'})
})


app.post("/uploads", upload.single('file'), function (req, res) {
   console.log('file Uploaded')
})


app.listen(8000, function () {
   console.log('App is listening')
})