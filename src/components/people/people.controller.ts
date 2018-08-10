import { Request, Response } from "express";
import {
  controller,
  httpGet,
  requestParam,
  response,
  request
} from "inversify-express-utils";
import { inject } from "inversify";
import { PeopleService } from "./people.service";
import { classToPlain } from "class-transformer";
import { SG } from "../shared/serializer-groups";
import { withParams } from "../../lib/validations";
import { GetByIdParams } from "../shared/dto/get-by-id.params";

@controller("/people")
export class PeopleController {
  constructor(@inject("PeopleService") private peopleService: PeopleService) {}

  @withParams(GetByIdParams)
  @httpGet("/:id")
  private async handleGet(@request() req: Request, @response() res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);
    res.json(classToPlain(person));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withEmail")
  async handleGetWithEmail(@request() req: Request, @response() res: Response) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);
    res.json(classToPlain(person, { groups: [SG.Person.withEmail] }));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withPhotos")
  async handleGetWithPhotos(
    @request() req: Request,
    @response() res: Response
  ) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(classToPlain(person, { groups: [SG.Person.withPhotos] }));
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withPhotosAndSecrets")
  async handleGetWithPhotosAndSecrets(
    @request() req: Request,
    @response() res: Response
  ) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(
      classToPlain(person, {
        groups: [SG.Person.withPhotos, SG.Global.withSecrets]
      })
    );
  }

  @withParams(GetByIdParams)
  @httpGet("/:id/withPhotosAndPhotoSecrets")
  async handleGetWithPhotosAndPhotoSecrets(
    @request() req: Request,
    @response() res: Response
  ) {
    let params = req.params as GetByIdParams;
    let person = await this.peopleService.findById(params.ID);

    res.json(
      classToPlain(person, {
        groups: [SG.Person.withPhotos, SG.Photo.withSecrets]
      })
    );
  }
}
