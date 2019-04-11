const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

const SSR_API_SERVER = process.env.SSR_API_SERVER;
const client = axios.create({
  baseURL: SSR_API_SERVER ? SSR_API_SERVER : "http://localhost:8000"
  /* other custom settings */
});

console.log("API server", client.defaults);

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
            /\$TITLE/g,
            title ? title.substring(0, 160) : "Storytelling with maps"
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
