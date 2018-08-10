export * from "../people/people.serializer-groups";
export * from "../photos/photos.serializer-groups";

export namespace SG {
  export const enum Global {
    withSecrets = "withSecrets"
  }

  export const enum Person {
    withPhotos = "person.withPhotos",
    withEmail = "person.withEmail",
    withSecrets = "person.withSecrets"
  }

  export const enum Photo {
    withSecrets = "photo.withSecrets",
    withPerson = "photo.withPerson"
  }
}
