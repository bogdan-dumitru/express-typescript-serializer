### Patter proposal for typescript migration

#### Running

```
$ npm install
$ npx ts-node src/index.ts
```

Navigate to `localhost:5555/ratings/123`. `localhost:5555/others`, `localhost:5555/others/hello` for 3 routes on the 2 respective controllers.
Navigate to `localhost:5555/ratings/asdd` to see the validations kick in.

#### Components

##### Controller

A little abstract class written by me that helps define routes with decorators for a cleaner approach, replaces the `AsyncRoute` helper.

Benefits:
- Reduce boilerplate
- Enforce route handler method signatures

It works by keeping track of all the methods that are marked as actions (with the `@Action` decorator) on the controller prototype, and then when the controller is instantiated it sets up a router instance with all the defined routes.

##### class-transform

This is used for serializing models. In this example I used some pure typescript classes to illustrate the models, but it works the same with the sequelize model classes that get created when we 



