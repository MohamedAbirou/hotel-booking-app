import express, { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { userLoginValidationSchema } from "../utils/validationSchemas";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { checkSession } from "../middleware/auth";

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

const router = express.Router();

router.post(
  "/login",
  checkSchema(userLoginValidationSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).json({ message: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // If the user has an old session, destroy it
      if (user.sessionId) {
        req.sessionStore.destroy(user.sessionId, (err) => {
          if (err) {
            console.log("Error destroying old session:", err);
          }
        });
      }

      // Store user ID in the session
      req.session.userId = user.id;

      // Store the new session ID in the user document
      user.sessionId = req.sessionID;
      await user.save();

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

// router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
//   res.status(200).send({ userId: req.userId });
// });

router.get("/check-session", checkSession, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Could not log out, please try again." });
    }

    res.clearCookie("auth_cookie");
    res.send();
  });
});

export default router;
