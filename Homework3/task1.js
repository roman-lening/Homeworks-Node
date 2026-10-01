const fs = require("fs");
const path = require("path");

const myDir = __dirname;

fs.mkdir(path.join(myDir, "myFolder"), (err) => {
  if (err) {
    console.error("Error: ", err);
  }
  console.log("Dir created");
  setTimeout(() => {
    fs.rmdir(path.join(myDir, "myFolder"), (err) => {
      if (err) {
        console.error("Error: ", err);
      }
      console.log("Dir deleted");
    });
  }, 1000);
});

// setTimeout для визуальной поверки
