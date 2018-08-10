import { Expose, Type, Exclude } from "class-transformer";
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement
} from "sequelize-typescript";
const { INTEGER, STRING } = DataType;
import { Person } from "../people/people.model";
import { SG } from "../shared/serializer-groups";

@Table
@Exclude()
export class Photo extends Model<Photo> {
  @PrimaryKey
  @AutoIncrement
  @Column(INTEGER)
  @Expose()
  id: number;

  @Column(STRING({ length: 100 }))
  @Expose()
  url: string;

  @Column({ type: STRING({ length: 100 }) })
  @Expose({ groups: [SG.Global.withSecrets, SG.Photo.withSecrets] })
  secretUrl: string;

  @ForeignKey(() => Person)
  @Column(INTEGER)
  @Expose()
  personId: number;

  @BelongsTo(() => Person)
  @Type(() => Person)
  @Expose({ groups: [SG.Photo.withPerson] })
  person: Person;
}
