const fs = require("fs");
const path = require("path");
const User = require("./models/User");
const City = require("./models/city");

function ReadFile() {
  const filePath = path.join(__dirname, "public/read.txt");

  //this will not stop the code execution because the callback function is registerd in callback queue
  // which executes the same in background once call stack execution is  empty event loop will pass the callback funtion
  // to call stack and the cb function gets executed

  fs.readFile(filePath, "utf-8", function (err, data) {
    console.log(data, "async");
    if (err) {
      console.log(err);
    }
  });

  // this stops code execution till the file is read
  try {
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    console.log(data, "sync");
  } catch (error) {
    console.log(error);
  }
}
module.exports = ReadFile;
