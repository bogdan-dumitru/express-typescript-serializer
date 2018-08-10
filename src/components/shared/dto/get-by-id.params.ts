import { IsNumberString } from "class-validator";

export class GetByIdParams {
  @IsNumberString()
  id: string;

  get ID() {
    return parseInt(this.id, 10);
  }
}
