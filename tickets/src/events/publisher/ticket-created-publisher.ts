import { Publisher, Subjects, TicketCreatedEvent } from "@showsphere/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

// new TicketCreatedPublisher()
