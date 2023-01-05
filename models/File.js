const mongoose = require("mongoose")

const File = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  password: String,
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },
})

    // first is the name of the table in the database and second "File" is  our schema
   
  module.exports = mongoose.model("File", File)