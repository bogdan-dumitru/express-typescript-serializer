import "reflect-metadata";
import express from "express";
import { validationError } from "./lib/validations";
import bodyParser from "body-parser";
import "./lib/initControllers";
import { initSequelize } from "./lib/initSequelize";
import { container } from "./lib/initServices";
import { InversifyExpressServer } from "inversify-express-utils";

initSequelize();

const app = express();
app.set("host", "localhost");
app.set("port", "5555");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validationError);

let server = new InversifyExpressServer(container, null, null, app);
server.build().listen(5555);
