const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const keys = require('../config/keys.js');
const connectionUrl = keys.mongoURI;
const databaseName = "dream-11";

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error)
        return console.log(error);

    db = client.db(databaseName);
    router.post("/contests", async(req, res) => {
        const contest = req.body;
        console.log(contest);
        try {
            await db.collection('Contests').insertOne(contest);
            res.status(201).send(contest);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.get("/contests", auth, async(req, res) => {
        try {
            const contests = await db.collection("Contests").find().toArray();
            console.log(contests);
            res.status(200).send(JSON.stringify(contests));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })
});


module.exports = router;