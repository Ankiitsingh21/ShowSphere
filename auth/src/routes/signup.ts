import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validateRequest ,BadRequestError} from "@showsphere/common";
import { User } from "../modals/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log("Email in use");
      // return res.send({});
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  },
);

export { router as signupRouter };
