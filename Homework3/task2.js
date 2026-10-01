const fs = require("fs");

fs.writeFile("info.txt", "Node.js is awesome!", (err) => {
  if (err) {
    console.error("Error: ", err);
  }
  fs.readFile("info.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error: ", err);
    }
    console.log(data);
  });
});
