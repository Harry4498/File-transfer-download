
require("dotenv").config()
const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const  express = require ("express")
const  File = require  ( "./models/File")

const app = express();
app.use (express.urlencoded({extended:true}))

mongoose.connect (process.env.DATABASE_URL,
  {
  useNewUrlParser: true,
  useUnifiedTopology: true
  });

mongoose.set('strictQuery', true);

// it will initialize multer and all the file goes inside a folder called uploads 
const upload  = multer ({dest: "uploads"}) 

// In this case, the express.urlencoded() middleware is being used to parse request bodies that are encoded in the application/x-www-form-urlencoded format.
//The express.urlencoded() middleware is often used to parse form data that is submitted via an HTML form
app.set("view engine", "ejs")

console.log(" Hello World ")

app.get("/", (req, res) => {
    res.render("index")
})



 // here upload is a middleware which  tells that before we handle the request we need to do uploading of the single file name " file"

app.post('/upload',  upload.single ("file"),  async function (req, res) {
 const fileData = {
  path: req.file.path,
  originalName: req.file.originalname
 }

  if (req.body.password != null && req.body.password !=="")
  {
      fileData.password= await bcrypt.hash(req.body.password,10 )
  }

  const file = await File.create(fileData) 
  //  this will create a file 
  console.log(file)

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}`
 })
 // res.send ( file.originalName)
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

// or this way we can do this 

// app.get ("/file/:id",handleDownload)
// app.post ("/file/:id", handleDownload)



// now its time to download the  uploaded file from the database using its unique id generated 

async function handleDownload (req, res){
const file = await File.findById(req.params.id) 
    // this will providee the id of the file 

if (file.password != null ){
  if (req.body.password == null){
    res.render("password")
    return
  }
  if(!(await bcrypt.compare (req.body.password, file.password))) {
    res.render ("password",{error : true})
    return 
  }
}
  file.downloadCount++
  await file.save()
  console.log(file.downloadCount)

  res.download(file.path, file.originalName)
}


app.listen(process.env.PORT, () => {
  console.log("server has been started at port 3000");
});
