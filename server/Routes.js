const express = require('express');
const router = express.Router();
const Message = require('./messageModel')



router.post('/PostMessage', async (req, res) => {
    const data = req.body;
    console.log(data);
    if(!data.message || !data.date || !data.UserId ) return res.status(400).json({success:false, message:'Please fill up the message feild!'});
    const messages = await Message({
        message: data.message,
        date: data.date,
        UserId: data.UserId,
        userName: data.userName
    })

    try {
        await messages.save()
    } catch (err) {
        console.log(err.message);
    }

    res.status(200).json({success:true, message:'Message has been loaded to the database'});
})

router.get('/GetallMessages', async (req, res) => {
    const messages = await Message.find();

    res.status(200).json({success:true, message:'get all the message', messages});
})



router.put('/DeleteMessage', async(req, res) => {
    await Message.deleteMany();

    res.status(200).json({success:true, message:'all message deleted successfully!'});
})


router.delete('/DeleteEachItem', async(req, res) => {

    const dataid = req.headers;
    if(!dataid) return res.status(400).json({success:false, message:'No Message Found!'});
    const message =await Message.deleteOne({id:dataid.id})
    res.status(200).json({success:true, message:'message deleted!'});
})

module.exports = router