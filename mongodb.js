const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = "mongodb://127.0.0.1/27017";
const databaseName = "dream-11";
const db;

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error)
        return console.log(error);

    db = client.db(databaseName);
    db.collection('users').deleteMany({
        name: 'Vikas',
        age: 26
    }).then(result=>{
        console.log(result);
    }).catch(ex=>{
        console.log(ex);
    })
    
})