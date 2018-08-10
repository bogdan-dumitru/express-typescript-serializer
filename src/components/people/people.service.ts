import { Person } from "./people.model";
import { Photo } from "../photos/photos.model";
import { provide } from "inversify-binding-decorators";

@provide("PeopleService")
export class PeopleService {
  async findById(id: number) {
    return await Person.findById(id, {
      include: [{ model: Photo, as: "photos" }]
    });
  }
}
