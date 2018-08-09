import { Request, Response } from "express";
import { Controller, Get, Post, WithBody, WithParams } from "./lib/Controller";
import { Person, Photo, SG } from "./models";
import { classToPlain } from "class-transformer";
import { IsInt, Length, IsNumberString } from "class-validator";

class GetByIdParams {
  @IsNumberString()
  id: string;

  get ID() {
    return parseInt(this.id, 10);
  }
}

class PhotoPayload {
  @Length(10, 20)
  url: string;

  @Length(10, 20)
  secretUrl: string;

  @IsInt()
  personId: number;
}

class PeopleService {
  async findById(id: number) {
    return await Person.findById(id, {
      include: [{ model: Photo, as: "photos" }]
    });
  }
}

class PhotosService {
  async findById(id: number) {
    return await Photo.findById(id, {
      include: [{ model: Person, as: "person" }]
    });
  }
}

export class PeopleController extends Controller {
  public baseRoute = "people/";
  public peopleService = new PeopleService();

  @Get("/:id")
  @WithParams(GetByIdParams)
  async handleGet(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(classToPlain(person));
  }

  @Get("/:id/withEmail")
  @WithParams(GetByIdParams)
  async handleGetWithEmail(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(classToPlain(person, { groups: [SG.Person.withEmail] }));
  }

  @Get("/:id/withPhotos")
  @WithParams(GetByIdParams)
  async handleGetWithPhotos(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(classToPlain(person, { groups: [SG.Person.withPhotos] }));
  }

  @Get("/:id/withPhotosAndSecrets")
  @WithParams(GetByIdParams)
  async handleGetWithPhotosAndSecrets(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(
      classToPlain(person, {
        groups: [SG.Person.withPhotos, SG.Global.withSecrets]
      })
    );
  }

  @Get("/:id/withPhotosAndPhotoSecrets")
  @WithParams(GetByIdParams)
  async handleGetWithPhotosAndPhotoSecrets(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(
      classToPlain(person, {
        groups: [SG.Person.withPhotos, SG.Photo.withSecrets]
      })
    );
  }
}

export class PhotosController extends Controller {
  public baseRoute = "photos/";
  public photosService = new PhotosService();

  @Post("/")
  @WithBody(PhotoPayload)
  async handlePost(req: Request, res: Response) {
    let photo = await Photo.create(req.body);
    photo.person = <Person>await photo.$get("Person");
    res.json(classToPlain(photo, { groups: [SG.Photo.withPerson] }));
  }

  @Get("/:id")
  @WithParams(GetByIdParams)
  async handleGet(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);

    res.json(classToPlain(photo));
  }

  @Get("/:id/withPerson")
  @WithParams(GetByIdParams)
  async handleGetWithPerson(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);

    res.json(classToPlain(photo, { groups: [SG.Photo.withPerson] }));
  }

  @Get("/:id/withPersonAndPersonSecrets")
  @WithParams(GetByIdParams)
  async handleGetWithPhotos(req: Request, res: Response) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);

    res.json(
      classToPlain(photo, {
        groups: [SG.Photo.withPerson, SG.Person.withSecrets]
      })
    );
  }
}
