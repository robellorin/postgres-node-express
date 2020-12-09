const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const http = require("http");
const server = http.createServer(app);

app.use(cors());

const indexRoute = require("./routes");
const apiIndexRoute = require("./routes/api");
const usersRoute = require("./routes/api/users");

app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(bodyParser.json({ limit: "1000mb", extended: true }));

app.use("/api/users", usersRoute);
app.use("/api", apiIndexRoute);
app.use("/", indexRoute);

const port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () =>
  console.log(`Server running on port ${port}`)
);

module.exports = app;
