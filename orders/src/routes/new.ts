import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@showsphere/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPRIATION_WINDOW_SECOND = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //Find the ticket the user is trying to order in the database

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //Make sure that this ticket is not reserved
    //Run a query to look at all order. Find an order where the ticket
    //is the ticket we just found and the order status is not cancelled
    //if we find an order from that means the ticket is reserved
    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      throw new BadRequestError("Ticket is already resrved");
    }

    //Calculate an expiration date for this order

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPRIATION_WINDOW_SECOND);

    //Build the order and save it to the data base

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    //now cast an event that the order is craeted

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
