const { default: axios } = require("axios");
const express = require("express");
require("dotenv").config();

const fs = require("fs");
const parse = require("csv-parse");

//mongodb connection
require("./db/mongodb.connection");

//import models
const Data = require("./models/data");

const app = express();

const PORT = process.env.PORT;

const DATA_URL = "https://jsonplaceholder.typicode.com/comments";
const CSV_URL = "http://console.mbwebportal.com/deepak/csvdata.csv";
const BIG_CSV_URL = "http://console.mbwebportal.com/deepak/bigcsvdata.csv";

app.get("/populate", async (req, res) => {
  console.log("/get populate");
  //save json data to db
  axios.get(DATA_URL).then(async (response) => {
    let data = response.data;
    //console.log(data);
    //save data to the database
    await Data.saveJSONData(data);
  });

  //save csv data to db
  const response = await axios.get(CSV_URL, { responseType: "blob" });
  const file = response.data;
  //fs.writeFile("data.csv", file);
  console.log("file", file);

  //write file
  fs.writeFileSync("data.csv", file);

  //read file
  let datafile = fs.readFile("data.csv", function (err, filedata) {
    parse.parse(
      filedata,
      { columns: false, trim: true },
      async function (err, rows) {
        //console.log("rows:", rows);
        await Data.saveJSONData(rows);
      }
    );
  });
  console.log("datafile", datafile);

  res.json({ status: true });
});

//search as a query parameters
app.post("/search", async (req, res) => {
  //console.log(req.query);

  const { name, email, body, limit } = req.query;

  const retdata = await Data.findData(name, email, body, limit);

  return res.json(retdata);
});

app.listen(PORT, () => console.log("server has started at port", PORT));
