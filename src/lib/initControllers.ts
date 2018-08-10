import * as path from "path";
import { requireGlob } from "./requireGlob";

const controllerPath = path.join(__dirname, "../components/**/*.controller.*");
requireGlob(controllerPath);
