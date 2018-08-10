import "reflect-metadata";
import * as express from "express";
import { plainToClass } from "class-transformer";
import { Validator, ValidationError } from "class-validator";
import { interfaces } from "inversify-express-utils";

type Constructor<T> = { new (): T };

export const enum PayloadSource {
  body = "body",
  params = "params",
  query = "query"
}

export function withParams<PayloadType>(type: Constructor<PayloadType>) {
  return withPayloadType(type, PayloadSource.params);
}

export function withBody<PayloadType>(type: Constructor<PayloadType>) {
  return withPayloadType(type, PayloadSource.body);
}

export function withQuery<PayloadType>(type: Constructor<PayloadType>) {
  return withPayloadType(type, PayloadSource.query);
}

function withPayloadType<PayloadType>(
  type: Constructor<PayloadType>,
  source: PayloadSource
) {
  return function(target: any, key: string, value: any) {
    let metadataList: interfaces.ControllerMethodMetadata[] = Reflect.getMetadata(
      // https://github.com/inversify/inversify-express-utils/blob/master/src/constants.ts
      "inversify-express-utils:controller-method",
      target.constructor
    );
    let methodMetadata = metadataList.find(metadata => metadata.key === key);
    console.log(methodMetadata);
    if (methodMetadata === undefined) {
      throw `Could not find method definition for ${key} on ${
        target.constructor.name
      } ` + `when defining ${source} type. Check the order of decorators.`;
    } else {
      let validateMiddleware = validate(type, source);
      methodMetadata.middleware.unshift(validateMiddleware);
    }
    console.log(methodMetadata);
  };
}

let validator = new Validator();
function validate<PayloadType>(
  type: Constructor<PayloadType>,
  source: PayloadSource
): express.RequestHandler {
  return (req: express.Request, res: express.Response, next) => {
    let payload = plainToClass(type, req[source]);
    let errors = validator.validateSync(payload);
    if (errors.length > 0) {
      next(errors);
    } else {
      req[source] = payload;
      next();
    }
  };
}

export function validationError(err: Error, req, res, next) {
  if (err instanceof Array && err[0] instanceof ValidationError) {
    res
      .status(400)
      .json({
        errors: err.map(e => ({
          value: e.value,
          property: e.property,
          constraints: e.constraints
        }))
      })
      .end();
  } else {
    next(err);
  }
}
