import { CartRouter } from "../app/router/cart.routes";
import { MessageRouter } from "../app/router/message.routes";
import { MockRouter } from "../app/router/mock.routes";
import { ProductRouter } from "../app/router/product.routes";
import { SessionRouter } from "../app/router/session.routes";
import { UserRouter } from "../app/router/user.routes";
import { ViewRouter } from "../app/router/view.routes";

export default class Routes {
    public static routesList = [
        ProductRouter,
        UserRouter,
        CartRouter,
        MessageRouter,
        MockRouter,
        SessionRouter,
        ViewRouter
    ]
}