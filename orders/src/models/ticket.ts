import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id?: string;
  title: string;
  price: number;
  //   userId: string;
}

export interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  //   userId: string;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    //manipulate the JSON representation
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, ...rest } = attrs;

  if (id) {
    return new Ticket({
      _id: id,
      ...rest,
    });
  }

  return new Ticket(rest);
};
ticketSchema.methods.isReserved = async function () {
  const exitingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwiatingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!exitingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
