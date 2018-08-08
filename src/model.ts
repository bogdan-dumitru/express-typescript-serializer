import { Expose, Type } from "class-transformer";

export class Photo {
  id: number;
  url: string;
  @Expose({ groups: ["withSecrets"] })
  secret_url: string;

  constructor(id) {
    this.id = id;
    this.url = `http://${id}.photos.com`;
    this.secret_url = `http://${id}.secret-photos.com`;
  }

  @Expose({ name: "fallbackUrl", groups: ["withFallback"] })
  get fallback() {
    return this.url + "/other";
  }
}

export class User {
  id: number;
  email: string;
  name: string;

  @Expose({ groups: ["withSecrets"] })
  secret_name: string;

  @Type(() => Photo)
  photos: Photo[];

  constructor(id) {
    this.id = id;
    this.email = `${id}.hopkins@gmail.com`;
    this.name = `${id}nt hopkins`;
    this.secret_name = `${id}nt hopkins alias`;
    this.photos = [
      new Photo(id * 10 + 1),
      new Photo(id * 10 + 2),
      new Photo(id * 10 + 3)
    ];
  }
}
