import { Publisher, Subjects, TicketUpdatedEvent } from "@showsphere/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

// new TicketUpdatedPublisher()
