import { Router, Request, Response } from "express";
import { ValidationTypes, validate } from "./validations";

export class Controller {
  public router: Router;
  public handlers: RouteHandler[] = [];
  // Default middleware, override in controller
  public middleware: (req: Request, res: Response, next: Function) => void = (
    res,
    req,
    next
  ) => next();

  "constructor": typeof Controller;

  constructor() {
    this.router = Router();
    this.constructor.prototype.handlers.forEach((handler: RouteHandler) => {
      const { method, url, customFilters, func } = handler;
      const asyncFunc = (req, res, next) => {
        Promise.resolve(func.call(this, req, res)).catch(next);
      };

      let filters = [...validationFilters(func), ...(customFilters || [])];

      if (filters !== undefined) {
        this.router[method](url, filters, asyncFunc);
      } else {
        this.router[method](url, asyncFunc);
      }
    });
  }
}

const validationFilters = func => {
  const types = {
    body: func["__bodyType"],
    params: func["__paramsType"]
  };

  if (types.body !== undefined || types.params !== undefined) {
    return [validate(types)];
  } else {
    return [];
  }
};

const enum HttpMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete"
}

interface RouteHandler {
  func: (req: Request, res: ResponseInit) => Promise<any>;
  url: string;
  method: HttpMethod;
  customFilters?: any[];
}

export const Get = (url: string, filters?: Function[]) => {
  return match(HttpMethod.GET, url, filters);
};

export const Post = (url: string, filters?: Function[]) => {
  return match(HttpMethod.POST, url, filters);
};

export const Patch = (url: string, filters?: Function[]) => {
  return match(HttpMethod.PATCH, url, filters);
};

export const Delete = (url: string, filters?: Function[]) => {
  return match(HttpMethod.PATCH, url, filters);
};

const match = (method: HttpMethod, url: string, filters?: Function[]) => {
  return <Controller>(
    target: Controller,
    key: keyof Controller,
    descriptor: TypedPropertyDescriptor<
      (req: Request, res: Response) => Promise<any>
    >
  ) => {
    if (target.constructor.prototype.handlers === undefined) {
      target.constructor.prototype.handlers = [];
    }
    target.constructor.prototype.handlers.push({
      url,
      method,
      customFilters: filters,
      func: descriptor.value
    });
  };
};

export const WithParams = (paramsType: any) => {
  return annotateWith("__paramsType", paramsType);
};

export const WithBody = (bodyType: any) => {
  return annotateWith("__bodyType", bodyType);
};

const annotateWith = (annotationKey: string, annotationValue) => {
  return <Controller>(
    target: Controller,
    key: keyof Controller,
    descriptor: TypedPropertyDescriptor<
      (req: Request, res: Response) => Promise<any>
    >
  ) => {
    descriptor.value[annotationKey] = annotationValue;
  };
};
