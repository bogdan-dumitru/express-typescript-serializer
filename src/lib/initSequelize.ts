import { Sequelize } from "sequelize-typescript";
import { Photo } from "../components/photos/photos.model";
import { Person } from "../components/people/people.model";

export async function initSequelize() {
  const sequelize = new Sequelize({
    database: "test",
    dialect: "sqlite",
    username: "root",
    password: "",
    storage: ":memory:"
  });

  sequelize.addModels([Person, Photo]);

  const qi = sequelize.getQueryInterface();
  await qi.createTable("Person", {
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
  await qi.createTable("Photo", {
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

  let person1 = await Person.create({
    firstName: "Bogdan",
    lastName: "Dumitru",
    email: "bogdan.dumitru@email.com",
    password: "1234secret"
  });

  let person2 = await Person.create({
    firstName: "Maria",
    lastName: "Ionica",
    email: "maria.ionica@email.com",
    password: "1234secret"
  });

  let photo1 = await Photo.create({
    url: "http://public-url1",
    secretUrl: "http://secret-url1",
    personId: person1.id
  });

  let photo2 = await Photo.create({
    url: "http://public-url2",
    secretUrl: "http://secret-url2",
    personId: person1.id
  });

  let photo3 = await Photo.create({
    url: "http://public-url3",
    secretUrl: "http://secret-url3",
    personId: person2.id
  });

  let photo4 = await Photo.create({
    url: "http://public-url4",
    secretUrl: "http://secret-url4",
    personId: person2.id
  });
}
