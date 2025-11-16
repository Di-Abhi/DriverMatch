import { Router } from "express";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";
import AuthController from "../controllers/authController";

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/signup",
      upload.single("licensePhoto"),
      AuthController.signup
    );

    this.router.post("/login", AuthController.login);

    this.router.post("/logout", authMiddleware, AuthController.logout);
  }
}

export default new AuthRoutes().router;
