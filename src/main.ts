import "reflect-metadata";
import express from "express";
import { validationError } from "./lib/validations";
import { PeopleController, PhotosController } from "./controllers";
import bodyParser from "body-parser";

const people = new PeopleController();
const photos = new PhotosController();
const routes = [people, photos];

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
