import { Publisher, OrderCreatedEvent, Subjects } from "@showsphere/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
