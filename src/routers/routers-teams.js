const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const keys = require('../config/keys.js');

const connectionUrl = keys.mongoURI;
const databaseName = "dream-11";

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error)
        return console.log(error);

    db = client.db(databaseName);
    router.post("/teams", async(req, res) => {
        const team = req.body.data;
        console.log(team);
        try {
            const response = await db.collection('Teams').insertOne(team);
            res.status(201).send(response.insertedId);
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.patch("/teams/:id", async(req, res) => {
        const id = req.params.id;
        const contest_id = req.body.contest_id;
        try {
            const response = await db.collection("Teams").updateOne({"_id": ObjectId(id)}, {"$push": {"contests": contest_id}});
            res.status(201).send();
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.patch("/teams-remove/:id", async(req, res) => {
        const id = req.params.id;
        const contest_id = req.body.contest_id;
        try {
            const response = await db.collection("Teams").updateOne({"_id": ObjectId(id)}, {"$pull": {"contests": contest_id}});
            res.status(201).send();
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    router.patch("/teams-players/:id", async(req, res) => {
        const id = req.params.id;
        const players = req.body.players;
        try {
            const response = await db.collection("Teams").updateOne({"_id": ObjectId(id)}, {"$set": {"players": players}});
            res.status(201).send();
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    });

    

    router.get("/teams/:id", async(req, res) => {
        try {
            const id = req.params.id;
            const team = await db.collection("Teams").findById({_id: id}).toArray();
            res.status(200).send(JSON.stringify(team));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })

    router.get("/teams/", async(req, res) => {
        try {
            const query = req.body;
            const teams = await db.collection("Teams").find(query).toArray();
            res.status(200).send(JSON.stringify(teams));
        } catch(ex) {
            console.log(ex);
            res.status(400).send({error: ex.message});
        }
    })


});
module.exports = router;