import * as express from "express";
import { Request, Response } from "express";
// import connectDB from "/src/ormconfig";
import connectDB from "../src/ormconfig";
// create and setup express app
const app = express();
app.use(express.json());
//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});
// Create connection with database
connectDB();

/**
 * get datesystem
 */
app.get("/getsystemdate", async function (req: Request, res: Response) {
  let datee = new Date();
  console.log(datee);
  return res.send(datee);
});

const dsroute = require('../src/routes/ds_routes');
app.use('/DS', dsroute);

const gestionDS = require('../src/routes/GestionDS');
app.use('/gestionds', gestionDS)

const actionDS = require('../src/routes/ActionDS');
app.use('/actionds', actionDS)



const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
