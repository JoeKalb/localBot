const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    }, 
    houseNum:{
        type:Number,
        required:true
    }
})

const Student = mongoose.model("Student", StudentSchema)
module.exports = Student