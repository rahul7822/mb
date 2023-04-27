const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  postId: { type: Number },
  id: { type: Number },
  name: { type: String },
  email: { type: String },
  body: { type: String },
});

const Data = (module.exports = mongoose.model("data", dataSchema));

module.exports.saveJSONData = async function (data) {
  console.log("data length : ", data.length);
  Data.insertMany(data)
    .then((res) => console.log(`data saved ${data.length}`))
    .catch((err) => console.log("error saving bluk"));
};

module.exports.findData = async function (name, email, body, limit) {
  console.log("find data");

  let data = await Data.find({}).limit(limit);

  if (name) {
    data = data.filter((elm) => elm.name === name);
  }
  if (email) {
    data = data.filter((elm) => elm.email === email);
  }
  if (body) {
    data = data.filter((elm) => elm.body === body);
  }

  return data;
};
