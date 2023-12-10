import { Router } from "express";

export class RouterConfig<T> {
  public router: Router;
  public controller: T;
  public path: string;

  constructor(Controller: new () => T, path: string) {
    this.router = Router();
    this.controller = new Controller();
    this.path = path;
  }
}
