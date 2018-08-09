import express from "express";
import { validationError } from "./lib/validations";
import { RatingsController, OtherController } from "./controllers";
import bodyParser from "body-parser";

const ratings = new RatingsController();
const others = new OtherController();
const routes = [ratings, others];

const app = express();
app.set("host", "localhost");
app.set("port", "5555");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

for (let route of routes) {
  app.use("/" + route.baseRoute, route.router, route.middleware);
}

app.use(validationError);
app.listen(5555);
