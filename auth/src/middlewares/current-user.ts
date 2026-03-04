import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";

interface UserPayload {
  id: string;
  email: string;
}

// modification to the Express Request interface
// to include currentUser property
// This allows us to access currentUser in the request object
// without TypeScript errors.
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req.session);
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!,
    ) as UserPayload;
    // console.log(payload);
    req.currentUser = payload;
  } catch (err) {
    // throw new BadRequestError('JWT is incorrect');
    console.error("JWT verification failed:", err);
  }

  next();
};
