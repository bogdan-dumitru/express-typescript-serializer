import { Expose, Type, Exclude } from "class-transformer";
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  HasMany,
  AutoIncrement
} from "sequelize-typescript";
const { INTEGER, STRING } = DataType;
import { Photo } from "../photos/photos.model";
import { SG } from "../shared/serializer-groups";

@Table
@Exclude()
export class Person extends Model<Person> {
  @PrimaryKey
  @AutoIncrement
  @Column(INTEGER)
  @Expose()
  id: number;

  @Column(STRING({ length: 100 }))
  @Expose()
  firstName: string;

  @Column(STRING({ length: 100 }))
  @Expose()
  lastName: string;

  @Column(STRING({ length: 100 }))
  @Expose({ groups: [SG.Person.withEmail] })
  email: string;

  @Column(STRING({ length: 100 }))
  @Expose({ groups: [SG.Global.withSecrets, SG.Person.withSecrets] })
  password: string;

  @HasMany(() => Photo)
  @Type(() => Photo)
  @Expose({ groups: [SG.Person.withPhotos] })
  photos: Photo[];

  @Expose({ name: "name" })
  get fullName() {
    return this.firstName + " " + this.lastName;
  }
}
