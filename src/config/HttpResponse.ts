import { Response } from "express";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  // ACCEPTED = 202,
  // NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  // CONFLICT = 409,
  INTERNAL_SERVER = 500,
}

export class HttpResponse {
  static Ok(res: Response, data?: any): Response {
    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      status: "Ok",
      message: "Success",
      payload: data,
    });
  }

  static Created(res: Response, data?: any): Response {
    return res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      status: "Created",
      message: "Success",
      payload: data,
    });
  }

  static BadRequest(res: Response, message: string): Response {
    return res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      status: "Bad Request",
      message: message,
    });
  }

  static Unauthorized(res: Response, message: string): Response {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      status: "Unauthorized",
      message: message,
    });
  }

  static Forbidden(res: Response, message: string): Response {
    return res.status(HttpStatus.FORBIDDEN).json({
      code: HttpStatus.FORBIDDEN,
      status: "Forbidden",
      message: message,
    });
  }

  static NotFound(res: Response, message: string): Response {
    return res.status(HttpStatus.NOT_FOUND).json({
      code: HttpStatus.NOT_FOUND,
      status: "Not Found",
      message: message,
    });
  }

  static InternalServerError(res: Response, message: string): Response {
    return res.status(HttpStatus.INTERNAL_SERVER).json({
      code: HttpStatus.INTERNAL_SERVER,
      status: "Internal Server Error",
      message: message,
    });
  }
}
