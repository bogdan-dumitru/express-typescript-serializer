import { Expose, Type, Exclude } from "class-transformer";
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  Sequelize,
  ForeignKey,
  BelongsTo,
  HasMany,
  AutoIncrement
} from "sequelize-typescript";
const { INTEGER, STRING } = DataType;

export namespace SG {
  export const enum Global {
    withSecrets = "withSecrets"
  }

  export const enum Person {
    withPhotos = "person.withPhotos",
    withEmail = "person.withEmail",
    withSecrets = "person.withSecrets"
  }

  export const enum Photo {
    withSecrets = "photo.withSecrets",
    withPerson = "photo.withPerson"
  }
}

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

const sequelize = new Sequelize({
  database: "test",
  dialect: "sqlite",
  username: "root",
  password: "",
  storage: ":memory:"
});

sequelize.addModels([Person, Photo]);

const qi = sequelize.getQueryInterface();
qi.createTable("Person", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  lastName: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  }
});
qi.createTable("Photo", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  personId: {
    type: Sequelize.INTEGER
  },
  url: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  secretUrl: {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null
  }
});

let person1promise = Person.create({
  firstName: "Bogdan",
  lastName: "Dumitru",
  email: "bogdan.dumitru@email.com",
  password: "1234secret"
});

let person2promise = Person.create({
  firstName: "Maria",
  lastName: "Ionica",
  email: "maria.ionica@email.com",
  password: "1234secret"
});

Promise.all([person1promise, person2promise]).then(value => {
  const [person1, person2] = value;
  let photo1 = Photo.create({
    url: "http://public-url1",
    secretUrl: "http://secret-url1",
    personId: person1.id
  });

  let photo2 = Photo.create({
    url: "http://public-url2",
    secretUrl: "http://secret-url2",
    personId: person1.id
  });

  let photo3 = Photo.create({
    url: "http://public-url3",
    secretUrl: "http://secret-url3",
    personId: person2.id
  });

  let photo4 = Photo.create({
    url: "http://public-url4",
    secretUrl: "http://secret-url4",
    personId: person2.id
  });
});
