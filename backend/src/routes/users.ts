import express, { Request, Response } from "express";
import User from "../models/user";
import { checkSchema, validationResult } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas";

const router = express.Router();

//  /api/users/register
router.post(
  "/register",
  checkSchema(createUserValidationSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user)
        return res.status(400).json({ message: "User already exists!" });

      user = new User(req.body);
      await user.save();

      // Log in the user by setting the userId in the session
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

      return res.status(200).json({ message: "User registered OK!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

export default router;
