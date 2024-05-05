import express from "express"
import cors from "cors"
import multer from "multer"
import { v4 as uuidv4 } from 'uuid'

import path from 'path'
import fs from 'fs'
import { exec } from "child_process" // Watch It -dangerous cmd for server
import { stderr, stdout } from "process"


const app = express()

// multer Middleware

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./uploads")
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
   },
})
// console.log('storage')

// Multer config

const upload = multer({
   storage: storage
})


//cors
app.use(
   cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
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
app.use("/uploads", express.static("uploads"))

console.log('serve')

app.get('/', function (req, res) {
   res.json({ message: 'Hello Code!' })
})

console.log('upload')

app.post("/upload", upload.single('file'), function (req, res) {
   // console.log('file Uploaded')
   const lessionId = uuidv4()
   const videoPath = req.file?.path
   console.log('inside upload2')
   const outputPath = `./uploads/courses/${lessionId}` // Folder Path
   const hlsPath = `${outputPath}/index.m3u8` // Unstiched video and UTF--8 ecode playlist file. Plain text files that can be used to store the URL paths of streaming audio or video and info about media tracks
   console.log('hlsPath', hlsPath)

   if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
   }
   // Magic comd
   //ffmpeg

   // No queue - POC not for production
   const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%3d.ts" -start_number 0 ${hlsPath}`;

   exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
         console.log(`exec error: ${error}`)
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      const videoUrl = `http://localhost:8000/uploads/courses/${lessionId}/index.m3u8`

      res.json({
         message: "Video converted to HLS format",
         videoUrl: videoUrl,
         lessionId: lessionId,
      })
   })
   
})


app.listen(8000, function () {
   console.log('App is listening')
})