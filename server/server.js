const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

const SSR_API_SERVER = process.env.SSR_API_SERVER;
const client = axios.create({
  baseURL: SSR_API_SERVER ? SSR_API_SERVER : "http://localhost:5000"
  /* other custom settings */
});

console.log("API server", client.defaults.baseURL);

app.get("/p/:uuid", function (request, response) {
  const headers = {
    "Content-Type": "application/json"
  };

  const filePath = path.resolve(__dirname, "../build", "index.html");
  fs.readFile(filePath, "utf8", function (err, html) {
    if (err) {
      return console.log(err);
    }
    client
      .get(`/p/${request.params.uuid}`, headers)
      .then(backendResponse => {
        if (backendResponse.status === 200) {
          const title = backendResponse.data["title"];
          const meta = backendResponse.data["meta"];
          if (meta && meta.canonical) {
            output = setCanonical(html, meta.canonical);
          }
          output = setTitles(output,
            title ? title.substring(0, 80) : "Storytelling with maps"
          );
          response.send(output);
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

app.get("*", function (request, response) {
  const filePath = path.resolve(__dirname, "../build", "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));


const setCanonical = (html, link) => {
  if (!link) return html;
  return html.replace(
    /__CANONICAL_LINK__/g,
    link
  );
}

const setTitles = (html, title) => {
  if (!link) return html;
  return html.replace(
    /__TITLE__/g,
    title
  );
} 