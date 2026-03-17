import { Publisher, Subjects, PaymentCreatedEvent } from "@showsphere/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
