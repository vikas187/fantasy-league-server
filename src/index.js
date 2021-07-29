const express = require('express');
const app = express();
require("./db/mongodb.js");
require("./db/mongoose.js");
const cors = require('cors');

const contestRoute = require("./routers/routers-contest");
const playerRoute = require("./routers/routers-players");
const routeMatches = require("./routers/routers-matches"); 
const userRoute = require("./routers/routers-user");
const teamRoute = require("./routers/routers-teams");
// const matchRoute = require("./routers/routers-match");

const port = process.env.PORT || 8080;
app.use(cors())
app.use(express.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(userRoute);
app.use(contestRoute);
app.use(playerRoute);
app.use(teamRoute);
app.use(routeMatches);

app.listen(port, ()=>{
    console.log("express is up and running");
})