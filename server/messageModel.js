const mongoose = require('mongoose');



const MessageSchema = new mongoose.Schema({
   message:{
    type:String,
    required:true,
   },
   date:{
    type:Date,
    required:true,
    default:Date.now,
   },
   UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   userName:{
    type:String,
    required:true,
   }
  
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = Message;