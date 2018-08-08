import { Router, Request, Response } from "express";

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
      const { method, url, filters, func } = handler;
      const asyncFunc = (req, res, next) => {
        Promise.resolve(func.call(this, req, res)).catch(next);
      };

      if (filters !== undefined) {
        this.router[method](url, filters, asyncFunc);
      } else {
        this.router[method](url, asyncFunc);
      }
    });
  }
}

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
  filters?: any[];
}

export const Action = {
  get: (url: string, filters?: Function[]) => {
    return Action.match(HttpMethod.GET, url, filters);
  },
  match: (method: HttpMethod, url: string, filters?: Function[]) => {
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
        filters,
        func: descriptor.value
      });
    };
  }
};
