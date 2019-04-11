const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

const API_SERVER_ENV = process.env.API_SERVER;
const client = axios.create({
  baseURL: API_SERVER_ENV ? API_SERVER_ENV : "http://localhost:8000"
  /* other custom settings */
});

app.get("/p/:uuid", function(request, response) {
  const headers = {
    "Content-Type": "application/json"
  };

  const filePath = path.resolve(__dirname, "../build", "index.html");
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    client
      .get(`/p/${request.params.uuid}`, headers)
      .then(backendResponse => {
        if (backendResponse.status === 200) {
          const title = backendResponse.data["title"];

          result = data.replace(
            /\$OG_TITLE/g,
            title ? title.substring(0, 160) : "Telling story with maps"
          );
          response.send(result);
        } else {
          response.sendFile(filePath);
        }
      })
      .catch(error => {
        response.sendFile(filePath);
      });
  });
});

app.use(express.static(path.resolve(__dirname, "../build")));

app.get("*", function(request, response) {
  const filePath = path.resolve(__dirname, "../build", "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
