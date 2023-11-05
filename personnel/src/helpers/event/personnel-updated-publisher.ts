import { Subjects, Publisher, PersonnelUpdatedEvent } from "@gams/utility";

/**
 * A publisher that publishes `PersonnelUpdatedEvent` events to the 'personnel:updated' subject.
 */
export class PersonnelUpdatedPublisher extends Publisher<PersonnelUpdatedEvent> {
  /**
   * The overidden subject that the publisher publishes events to equal to 'personnel:created'.
   */
  subject: Subjects.PersonnelUpdated = Subjects.PersonnelUpdated;
}
