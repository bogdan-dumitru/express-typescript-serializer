import { Request, Response } from "express";
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  response,
  requestParam,
  request
} from "inversify-express-utils";
import { inject } from "inversify";
import { PhotosService } from "./photos.service";
import { classToPlain } from "class-transformer";
import { SG } from "../shared/serializer-groups";
import { withParams, withBody } from "../../lib/validations";
import { GetByIdParams } from "../shared/dto/get-by-id.params";
import { CreatePhotoBody } from "./dto/create-photo.body";

@controller("/photos")
export class PhotosController {
  constructor(@inject("PhotosService") private photosService: PhotosService) {}

  @withBody(CreatePhotoBody)
  @httpPost("/")
  async handlePost(
    @requestBody() body: CreatePhotoBody,
    @response() res: Response
  ) {
    let photo = await this.photosService.create(body);
    res.json(classToPlain(photo, { groups: [SG.Photo.withPerson] }));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id")
  async handleGet(@request() req: Request, @response() res: Response) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);
    res.json(classToPlain(photo));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withPerson")
  async handleGetWithPerson(
    @request() req: Request,
    @response() res: Response
  ) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);
    res.json(classToPlain(photo, { groups: [SG.Photo.withPerson] }));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withPersonAndPersonSecrets")
  async handleGetWithPhotos(
    @request() req: Request,
    @response() res: Response
  ) {
    let params = req.params as GetByIdParams;
    let photo = await this.photosService.findById(params.ID);

    res.json(
      classToPlain(photo, {
        groups: [SG.Photo.withPerson, SG.Person.withSecrets]
      })
    );
  }
}
