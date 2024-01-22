import passport from "passport";
import { RouterConfig } from "../../config/RouterConfig";
import { SessionController } from "../controlller/session.controller";

export class SessionRouter extends RouterConfig<SessionController> {
  constructor() {
    super(SessionController, "/api/sessions");
    this.routes();
  }

  public routes(): void {
    // Github passport
    this.router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
    this.router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/sessions/faillogin' }), this.controller.loginGitHubPassport.bind(this.controller));
    //JWT passport
    this.router.get('/current',passport.authenticate('current', {session: false}), async (req, res) => {res.status(200).send(req.user)});
    // POST ROUTES
    this.router.post('/forgotpassword', this.controller.forgotPassword.bind(this.controller));
    this.router.post('/resetPassword', passport.authenticate('current', {session: false}), this.controller.resetPassword.bind(this.controller));
    // Local passport
    this.router.post('/login', passport.authenticate('login', { failWithError: true }), this.controller.loginUserPassport.bind(this.controller));
    this.router.post('/register', passport.authenticate('register', { failWithError: true }), this.controller.registerUserPassport.bind(this.controller));
  }
}
