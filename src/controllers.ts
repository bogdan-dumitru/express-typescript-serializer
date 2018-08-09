import "reflect-metadata";
import { Request, Response } from "express";
import { Controller, Get, Post, WithBody, WithParams } from "./lib/Controller";
import { User } from "./model";
import { serialize, classToPlain } from "class-transformer";
import { validate } from "./lib/validations";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsIn
} from "class-validator";

class UserService {
  getAll() {
    return [new User(1), new User(2)];
  }
  getOne() {
    return [new User(3)];
  }
}

class GetRatingsParams {
  id: string;
}

class CreateRatingBody {
  @IsInt()
  @Min(0)
  @Max(5)
  value: number;

  @Contains("hello")
  @Length(10, 100)
  note: string;
}

export class RatingsController extends Controller {
  public baseRoute = "ratings/";
  private service = new UserService();

  @Get("/:id")
  @WithParams(GetRatingsParams)
  async handleIndex(req: Request, res: Response) {
    let params = req.params as GetRatingsParams;

    res.json(
      classToPlain(this.service.getAll(), { groups: ["withUserSecrets"] })
    );
  }

  @Post("/", [validate({ body: CreateRatingBody })])
  @WithBody(CreateRatingBody)
  async handlePost(req: Request, res: Response) {
    debugger;
    res.json(classToPlain(req.body));
  }
}

export class OtherController extends Controller {
  public baseRoute = "others/";
  private service = new UserService();

  @Get("/")
  async handleIndex(req: Request, res: Response) {
    res.json(
      classToPlain(this.service.getOne(), { groups: ["withPhotoSecrets"] })
    );
  }

  @Get("/hello")
  async handleHello(req: Request, res: Response) {
    debugger;

    res.json(
      classToPlain(this.service.getAll(), {
        groups: ["withSecrets", "withFallback"]
      })
    );
  }
}
