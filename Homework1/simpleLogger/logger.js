const fs = require("fs");

function logMessage(msg) {
  fs.appendFile("log.txt", msg, (err) => {
    if (err) throw err;
  });
}

module.exports = { logMessage };
