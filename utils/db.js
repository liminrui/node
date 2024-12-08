const mongoose = require("mongoose");

function main() {
  console.log("main: ");
  // console.log("db: ", db);
  return mongoose.connect("mongodb://127.0.0.1:27017/test");
}

main()
  .then((res) => {
    console.log("mongodb connected!");
  })
  .catch((err) => {
    console.log("err: ", err);
  });
