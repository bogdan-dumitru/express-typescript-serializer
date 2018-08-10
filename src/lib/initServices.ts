import * as path from "path";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { requireGlob } from "./requireGlob";

const servicesPath = path.join(__dirname, "../components/**/*.service.*");
requireGlob(servicesPath);

export const container = new Container();
container.load(buildProviderModule());
