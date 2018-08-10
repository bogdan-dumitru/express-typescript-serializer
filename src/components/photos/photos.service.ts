import { Photo } from "./photos.model";
import { Person } from "../people/people.model";
import { provide } from "inversify-binding-decorators";

@provide("PhotosService")
export class PhotosService {
  async findById(id: number) {
    return await Photo.findById(id, {
      include: [{ model: Person, as: "person" }]
    });
  }
  async create(attributes: any) {
    let photo = await Photo.create(attributes);
    photo.person = <Person>await photo.$get("Person");
    return photo;
  }
}
