require('dotenv').config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require('cors');
const rootRouter = require("./routers");
const { JWT_SECRET, mongoDBURL } = require("./config");


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', rootRouter);

app.listen(3000);

async function main() {
    await mongoose.connect(mongoDBURL);
    console.log("mongoDB connected")
    console.log(JWT_SECRET);
}

main();




