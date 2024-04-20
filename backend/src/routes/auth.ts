import express, { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { userLoginValidationSchema } from "../utils/validationSchemas";
import User from "../models/user";
import bcrypt from "bcryptjs";

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

      // Store user ID in the session
      req.session.userId = user.id;

      // const token = jwt.sign(
      //   { userId: user.id },
      //   process.env.JWT_SECRET_KEY as string,
      //   {
      //     expiresIn: "1d",
      //   }
      // );

      // res.cookie("auth_token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   maxAge: 86400000,
      // });

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

router.get("/check-session", (req: Request, res: Response) => {
  if (req.session.userId) {
    res.status(200).send({ userId: req.session.userId });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Could not log out, please try again." });
    }

    res.clearCookie("connect.sid");
    res.send();
  });
});

export default router;
