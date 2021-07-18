const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const keys = require('../config/keys.js');

const connectionUrl = keys.mongoURI;
const databaseName = "dream-11";

let db;

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error)
        return console.log(error);

    db = client.db(databaseName);
})

