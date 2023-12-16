import { RouterConfig } from "../../config/RouterConfig";
import { MockController } from "../controlller/mock.controller";

export class MockRouter extends RouterConfig<MockController> {
  constructor() {
    super(MockController, "/api/mock");
    this.routes();
  }

  public routes(): void {
    this.router.get('/mockingproducts', this.controller.getProductsMock.bind(this.controller));
  }
}
