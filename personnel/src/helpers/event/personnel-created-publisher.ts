import { Subjects, Publisher, PersonnelCreatedEvent } from "@gams/utility";

/**
 * A publisher that publishes `PersonnelCreatedEvent` events to the 'personnel:created' subject.
 */
export class PersonnelCreatedPublisher extends Publisher<PersonnelCreatedEvent> {
  /**
   * The overidden subject that the publisher publishes events to equal to 'personnel:created'.
   */
  subject: Subjects.PersonnelCreated = Subjects.PersonnelCreated;
}
