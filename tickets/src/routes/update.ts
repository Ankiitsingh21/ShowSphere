import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@showsphere/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required!"),

    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundError(); // return 404 instead of 400
    }

    const ticket = await Ticket.findById(id);
    // console.log(ticket);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title:req.body.title,
      price:req.body.price
    });

    await ticket.save();

    res.send(ticket);
  },
);

export { router as updateTicketRouter };
