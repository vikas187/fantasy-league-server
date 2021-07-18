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

app.use(userRoute);
app.use(contestRoute);
app.use(playerRoute);
app.use(teamRoute);
app.use(routeMatches);

app.listen(port, ()=>{
    console.log("express is up and running");
})