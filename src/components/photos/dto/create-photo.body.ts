import { Length, IsInt } from "class-validator";

export class CreatePhotoBody {
  @Length(10, 20)
  url: string;

  @Length(10, 20)
  secretUrl: string;

  @IsInt()
  personId: number;
}
