import express from "express";
import { userRoutes } from "./routes/user.routes";

const app = express();
app.use(express.json());

//ROUTING
app.use(userRoutes);

app.listen("8080", (request, response) => console.log("Listening"));
