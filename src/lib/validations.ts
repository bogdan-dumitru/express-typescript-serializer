import * as express from "express";
import { plainToClass } from "class-transformer";
import { Validator, ValidationError } from "class-validator";

type Constructor<T> = { new (): T };

export interface ValidationTypes<BodyType, ParamsType> {
  body?: Constructor<BodyType>;
  params?: Constructor<ParamsType>;
}

export function validate<BodyType, ParamsType>(
  types: ValidationTypes<BodyType, ParamsType>
): express.RequestHandler {
  let validator = new Validator();

  return (req: express.Request, res: express.Response, next) => {
    let bodyErrors = [],
      paramsErrors = [];
    let body, params;
    if (types.body !== undefined) {
      body = plainToClass(types.body, req.body);
      bodyErrors = validator.validateSync(body);
    }
    if (types.params !== undefined) {
      params = plainToClass(types.params, req.params);
      paramsErrors = validator.validateSync(params);
    }
    let errors = [...bodyErrors, ...paramsErrors];

    if (errors.length > 0) {
      next(errors);
    } else {
      if (body !== undefined) {
        req.body = body;
      }
      if (params !== undefined) {
        req.params = params;
      }
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
