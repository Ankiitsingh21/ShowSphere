import { Publisher,OrderCancelledEvent,Subjects } from "@showsphere/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
        subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
}

