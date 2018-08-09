### Patter proposal for typescript migration

#### Running

```
$ npm install
$ npx nodemon
```

#### Purpose

Serves as an example project to illustrate proposals for how to handle controllers, validation and serialization.

#### Components

##### Controller

A little abstract class written by me that helps define routes with decorators for a cleaner approach, replaces the `AsyncRoute` helper.

Benefits:
- Reduce boilerplate
- Enforce route handler method signatures

It works by keeping track of all the methods that are marked as actions (with the `@Action` decorator) on the controller prototype, and then when the controller is instantiated it sets up a router instance with all the defined routes.

##### class-transform

This is used for serializing models. In this example I used some pure typescript classes to illustrate the models, but it works the same with the sequelize model classes that get created when we 



