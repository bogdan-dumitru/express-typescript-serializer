import { Expose, Type } from "class-transformer";

export class Photo {
  id: number;
  url: string;

  @Expose({ groups: ["withPhotoSecrets", "withSecrets"] })
  secret_url: string;

  constructor(id) {
    this.id = id;
    this.url = `http://${id}.photos.com`;
    this.secret_url = `http://${id}.secret-photos.com`;
  }

  @Expose({ name: "fallback_url", groups: ["withFallback"] })
  get fallback() {
    return this.url + "/other";
  }
}

export class User {
  id: number;
  email: string;
  name: string;

  @Expose({ groups: ["withUserSecrets", "withSecrets"] })
  secret_name: string;

  @Type(() => Photo)
  photo: Photo;

  constructor(id) {
    this.id = id;
    this.email = `${id}.hopkins@gmail.com`;
    this.name = `${id}nt hopkins`;
    this.secret_name = `${id}nt hopkins alias`;
    this.photo = new Photo(id * 10 + 1);
  }
}
