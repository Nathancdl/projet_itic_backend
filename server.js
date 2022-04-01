require('babel-polyfill');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("express-async-errors");

import "./constants/system";
import "./constants/errors";
import "./errors/CustomError";
import routes from "./routes";
import database from "./database/index";

const requestIp = require("request-ip");
import catchMiddleware from "./middlewares/catch";

const app = express();
const PORT = 3000

async function Init() {
  await database.init();
  
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
  });
  
  const corsConfig = {
    credentials: true,
    origin: true,
  };
  
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestIp.mw());
  
  routes.create(app, express);
  
  app.use(catchMiddleware);
  
  // Listen the server
  app.listen(PORT);
  console.log(`Server listening on port ${PORT}`);
}

Init();
