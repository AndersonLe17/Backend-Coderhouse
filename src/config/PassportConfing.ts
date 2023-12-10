import { PassportStatic } from "passport";
import { User } from "../app/dao/domain/user/User";
import UserService from "../app/services/user.service";
import local from "passport-local";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/bcrypt";
import { Request } from "express";
import { Profile, Strategy } from "passport-github2";
import { ServerConfig } from "./ServerConfig";
import { cookieExtractor } from "../utils/cookies";

export class PassportConfig extends ServerConfig{
  private readonly userService: UserService;
  private readonly LocalStrategy: typeof local.Strategy;
  private readonly JWTStrategy: typeof jwt.Strategy;
  private readonly ExtractJWT: typeof jwt.ExtractJwt;

  constructor(passport: PassportStatic) {
    super();
    this.userService = new UserService();
    this.LocalStrategy = local.Strategy;
    this.JWTStrategy = jwt.Strategy;
    this.ExtractJWT = jwt.ExtractJwt;
    this.initialize(passport);
  }

  public async initialize(passport: PassportStatic): Promise<void> {
    passport.use("register", new this.LocalStrategy({ passReqToCallback: true, usernameField: "email"}, this.register.bind(this)));
    passport.use("login", new this.LocalStrategy({ usernameField: "email"}, this.login.bind(this)));

    passport.use("github", new Strategy({
      clientID: this.getStringEnv('GITHUB_CLIENT_ID'),
      clientSecret: this.getStringEnv('GITHUB_CLIENT_SECRET'),
      callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, this.github.bind(this)));

    passport.use("current", new this.JWTStrategy({
      jwtFromRequest: this.ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: this.getStringEnv('JWT_SECRET'),
    }, this.current.bind(this)));

    passport.serializeUser(this.serializeUser.bind(this));
    passport.deserializeUser(this.deserializeUser.bind(this));
  }

  public async register(req: Request, username: string, password: string, done: (error: any, user?: false | Express.User | undefined, options?: local.IVerifyOptions | undefined) => void): Promise<void> {
    try {
      const userRequest = req.body;
      const user = await this.userService.findOne({email: username});
      if (user) {
        return done(null, false, { message: "User already exists" });
      }

      const newUser = await this.userService.create({ ...userRequest, password: createHash(password)} as User);
      return done(null, newUser);
    } catch (error) {
      return done(`Error al obtener el usuario ${error}`);
    }
  }

  public async login(username: string, password: string, done: (error: any, user?: false | Express.User | undefined, options?: local.IVerifyOptions | undefined) => void): Promise<void> {
    try {
      const user = await this.userService.findOne({email: username});
      if (!user) {
        console.log("User doesn't exists");
        return done(null, false, { message: "User doesn't exists" }); 
      }
      
      if (!isValidPassword(user.password, password)) return done(null, false, { message: "Invalid password" });
      return done(null, user);
    } catch (error) {
      return done(`Error al obtener el usuario ${error}`);
    }
  }

  public async github(_accessToken: string, _refreshToken: string, profile: Profile, done: (error: any, user?: false | Express.User | undefined, options?: local.IVerifyOptions | undefined) => void): Promise<void> {
    try {
      const emailOrUsername = profile.emails?.[0].value || profile.username;
      const userDB = await this.userService.findOne({email: emailOrUsername});
      if (!userDB) {
        const user = await this.userService.create({
          fromGithub: true, 
          firstName: profile.displayName.split(' ')[0], 
          lastName: profile.displayName.split(' ')[1] || '', 
          email: emailOrUsername, password: ' ', 
          age: 18
        } as User);
        done(null, user);
      } else if (userDB.fromGithub) {
        done(null, userDB);
      } else {
        done(null, false, { message: "User already exists" });
      }
    } catch (error) {
      return done(`Error al obtener el usuario ${error}`);
    }
  }

  public async current(jwt_payload: any, done: jwt.VerifiedCallback): Promise<void> {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }

  public serializeUser(user: Express.User, done: (err: any, id?: unknown) => void): void {
    const userObj = user as User;
    done(null, userObj._id);
  }

  public async deserializeUser(id: string, done: (err: any, user?: false | Express.User | null | undefined) => void): Promise<void> {
    const user =  await this.userService.findById(id);
    const {email, firstName, role} = user as User;
    done(null, {email, firstName, role});
  }
}