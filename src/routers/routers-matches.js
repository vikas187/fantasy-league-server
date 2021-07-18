const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;
const keys = require('../config/keys.js');
const connectionUrl = keys.mongoURI;
const databaseName = "dream-11";

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error)
        return console.log(error);

    db = client.db(databaseName);
    router.post("/matches", async(req, res) => {
        const match = req.body;
        try {
            await db.collection('Matches').insertOne(match);
            res.status(201).send(match);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.post("/matches/multi", async(req, res) => {
        const matches = req.body;
        try {
            await db.collection('Matches').insertMany(matches);
            res.status(201).send(matches);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.get("/matches/:id", auth, async(req, res) => {
        try {
            const query = req.body;
            const _id = req.params.id;
            const matches = await db.collection("Matches").find({"_id": ObjectId(_id)}).toArray();
            res.status(200).send(JSON.stringify(matches));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })

    router.get("/matches", auth, async(req, res) => {
        try {
            const query = req.body;
            const matches = await db.collection("Matches").find(query).toArray();
            res.status(200).send(JSON.stringify(matches));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })


});
module.exports = router;