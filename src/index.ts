import express from "express";

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
	response.json("Successs");
});

app.listen("8080", (request, response) => console.log("Listening"));
