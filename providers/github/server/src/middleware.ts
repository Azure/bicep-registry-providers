import { ErrorRequestHandler, RequestHandler, Request, Response } from "express";
import { validate, Joi, ValidationError } from "express-validation";
import { createErrorResponse } from "./responses";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("Caught unhandled error:");
  console.log(err);

  if (err instanceof ValidationError) {
    let target = "";
    let message = err.message;
    if (err.details.body && err.details.body.length > 0) {
      // for now, let's just take the first validation error we see
      message = err.details.body[0].message;
      const path = (err.details.body[0] as any)?.path;
      if (Array.isArray(path)) {
        target = "/" + path.join("/");
      }
    }

    return res.status(200).json(createErrorResponse({
      code: "ValidationError",
      message,
      target,
    }));
  }

  if (err instanceof Error) {
    return res.status(200).json(createErrorResponse({
      code: err.name,
      message: err.message,
      target: "",
    }));
  }

  return res.status(200).json(createErrorResponse({
    code: "UnhandledError",
    message: `Something unexpected happened: ${err}`,
    target: "",
  }));
};

export const extensibilityContractValidator: RequestHandler = validate({
  body: Joi.object({
    import: Joi.object({
      provider: Joi.string().valid('github').required(),
      version: Joi.string().valid('v1').required(),
      config: Joi.object({
        accessToken: Joi.string().required()
      }).required()
    }),
    resource: Joi.object({
      type: Joi.string().required(),
      properties: Joi.object(),
    }),
  }),
}, {}, {});

// this is necessary because express 4 doesn't handle exceptions thrown in async functions
export const runAsyncWrapper = (cb: (body: Request<any>, res: Response<any>) => Promise<any>) => {
  const wrappedCb: RequestHandler = (req, res, next) => 
    cb(req, res).catch(next);

  return wrappedCb
}