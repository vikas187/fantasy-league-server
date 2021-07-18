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
    router.post("/players", async(req, res) => {
        const player = req.body;
        try {
            await db.collection('Players').insertOne(player);
            res.status(201).send(player);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.post("/players/multi", async(req, res) => {
        const player = req.body;
        try {
            await db.collection('Players').insertMany(player);
            res.status(201).send(player);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.get("/players/:team1/:team2", auth, async(req, res) => {
        try {
            const team1 = req.params.team1;
            const team2 = req.params.team2;
            const Players = await db.collection("Players").find({"$or":[{'team': team1},{'team': team2}]}).toArray();
            res.status(200).send(JSON.stringify(Players));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })

    router.get("/players", auth, async(req, res) => {
        try {
            const query = req.body;
            const Players = await db.collection("Players").find(query).toArray();
            res.status(200).send(JSON.stringify(Players));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })


});
module.exports = router;