import http from "http";
import fs from "fs";

// Задание 1

// const server = http.createServer((req, res) => {
//   if (req.headers.authorization === undefined) {
//     res.statusCode = 401;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Unauthorized");
//   } else {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Authorization header received");
//   }
// });

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Задание 2

// const server = http.createServer((req, res) => {
//   try {
//     throw new Error("Test server error");
//   } catch (error) {
//     fs.appendFile("errors.log", error.message, (err) => {
//       if (err) {
//         console.error("Error: ", err);
//       }
//     });
//     res.statusCode = 500;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Internal Server Error");
//   }
// });

// const port = 3000;

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Задание 3

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  if (method === "PUT") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`PUT-запрос обработан`);
  } else if (method === "DELETE") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`DELETE-запрос обработан`);
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
