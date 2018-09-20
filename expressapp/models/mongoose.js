const mongoose = require("mongoose");

const url =
  "mongodb://thakursaurabh1998:helloworld123@ds046667.mlab.com:46667/meepo";

mongoose.Promise = global.Promise;
mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));

module.exports = { mongoose };
