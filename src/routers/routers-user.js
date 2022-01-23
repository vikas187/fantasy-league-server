const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require('../models/users');
const multer = require('multer');
const sharp = require('sharp');
const fs = require("fs");
const cors = require("cors");

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg)$/)) {
            cb(new Error("Please upload jpg/jpeg file"));
        }
        cb(undefined, true);
    },
    storage: multer.diskStorage({
        destination: (req, file, callback) => {

        try {
            callback(null, "./src/images/uploads/");
        } catch(ex) {
            console.log(ex);
        }
          
        },

        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    
    }),
    
});

router.post('/users', async (req,res)=>{
    if(await User.findOne({email:req.body.email})) {
        res.status(200).send({error: 'This email already exists'});
        return;
    }
    const user = new User(req.body);
    

    try {
        const token = await user.getAuthToken();
        res.status(201).send({user, token});
    } catch(ex) {
        console.log(ex);
        res.status(200).send({error: ex.message});
    }  
});

router.post('/users/login', async(req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken();
        res.status(200).send({user, token});
    } catch(ex) {
        console.log(ex);
        res.status(200).send({autherror: ex.message});
    }
    
});

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!=req.token;
        });
        await req.user.save();
        res.send();
    } catch(ex) {
        console.log(ex);
        res.status(500).send(ex);
    }
})

router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(ex) {
        console.log(ex);
        res.status(200).send({error: ex});
    }
})

router.get("/users/me/avatar", auth, async(req, res)=>{
    try {
        console.log(req.user);
        if(req.user.avatar) {
            fs.readFile(__dirname + `/../images/uploads/${req.user.avatar}`, (err, data)=>{
                if(data) {
                    res.status(200).send(data.toString('base64'));
                } else {
                    res.status(200).send({error: "not uploaded"});
                }
                
            }); 
        } else {
            res.status(200).send({error: "No image"});
        }
        
    } catch(ex) {
        res.status(200).send({error: ex.message});
    }
})


router.get("/users/me", auth, async(req, res)=>{
    try {
        res.send(req.user);
    } catch(ex) {
        res.status(400).send(ex);
    }
});

router.get("/users/:id", async(req, res)=>{
    const _id = req.params.id;
    
    try {
        const user = await User.findById(_id);
        if(user) {
            res.send(user);
        } else {
            res.status(404).send();
        }
    } catch(ex) {
        res.status(500).send(ex);
    }
});

router.delete("/users/me", auth, async(req, res)=>{
    try {
        await req.user.remove();
        res.send("Successfully deleted");
    } catch(ex) {
        console.log(ex);
        res.status(500).send();
    }
})

router.patch("/users/me", auth, async(req,res)=>{
    try {
        const updates = Object.keys(req.body);
        const allowedUpdated = ['firstname', 'lastname', 'email', 'password'];

        const isAllowed = updates.every((update)=>allowedUpdated.includes(update));
        console.log(isAllowed);
        if(isAllowed) {
            const user = await User.findByIdAndUpdate(req.user._id, req.body);
            if(!user) {
                res.status(404).send();
            }
            console.log("updated user");
            res.status(200).send(user);
        } else {
            res.status(400).send();
        }

        
    } catch(ex) {
        res.status(400).send(ex);
    }
})

router.post("/users/me/avatar", auth, upload.single('upload'), async(req,res)=>{
    try {
        req.user.avatar = req.file.originalname;
        await req.user.save();
        res.status(200).send("Image updated successfully");
    } catch(ex) {

        res.status(200).send({error: ex.message});
    }
    
},(error, req, res, next)=>{
        res.status(400).send({'error': error.message});
});

router.delete("/users/me/avatar", auth, async(req,res)=>{
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch(ex) {
        res.status(500).send();
    }
    
},(error, req, res, next)=>{
        res.status(400).send({'error': error.message});
});

router.get("/users/:id/avatar", async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            res.status(404).send();
        }
        res.set("Content-type", "image/jpeg");
        res.send(user.avatar);
    } catch(ex) {
        res.status(500).send(ex.message);
    }
})


module.exports = router;