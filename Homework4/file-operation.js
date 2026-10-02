const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

fs.writeFile(process.env.FILENAME, "Hello, World!", (err) => {
  if (err) {
    console.error("Error: ", err);
  }
  fs.readFile(process.env.FILENAME, "utf8", (err, data) => {
    if (err) {
      console.error("Error: ", err);
    } else {
      console.log("Data: ", data);
    }
  });
});
