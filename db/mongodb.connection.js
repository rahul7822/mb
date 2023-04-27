const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then((res) => console.log("Mogodb connected successfully"))
  .catch((err) => console.log("error connecting mongodb :", err));
