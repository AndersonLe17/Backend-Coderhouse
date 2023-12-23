import express from "express";
import morgan from "morgan";
import { ServerConfig } from "./config/ServerConfig";
import Routes from "./utils/routes";
import { engine } from "express-handlebars";
import MongoConnect from "./app/dao/mongo/MongoConnect";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { PassportConfig } from "./config/PassportConfig";
import { logger } from "./utils/logger/winston";
import { errorMiddleware } from "./app/middlewares/error.middleware";
require("express-async-errors");

class App extends ServerConfig {
  public app: express.Application = express();
  public port: number = this.getNumberEnv('PORT');
  protected dirname: string = __dirname;

  constructor() {
    super();
    this.configuration();
    this.middlewares();
    MongoConnect.connectDatabase(this.getStringEnv('URL_MONGODB_ATLAS'));
    this.routers();
    this.listen();
  }

  private configuration(): void {
    this.app.engine('handlebars', engine());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', this.dirname + '/views');
  }

  private middlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use('/static', express.static(this.dirname + '/public'));   
    this.app.use(morgan('dev'));
    this.app.use(cookieParser());
    this.app.use(session({
      secret: this.getStringEnv('SECRET_SESSION'),
      cookie: {
          maxAge: this.getNumberEnv('EXPIRATION'),
      },
      resave: false,
      saveUninitialized: false,
    }));
    new PassportConfig(passport);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private routers(): void {
    const routesList = Routes.routesList;
    routesList.forEach((Route) => {
      const route = new Route();
      this.app.use(route.path, route.router);
    });
    this.app.use(errorMiddleware);
  }

  private listen(): void {
    const httpServer = this.app.listen(this.port, () => {
      logger.info(`Server running on port ${this.port}`);
    });
    this.app.set('io', new Server(httpServer));
  }
}

new App();