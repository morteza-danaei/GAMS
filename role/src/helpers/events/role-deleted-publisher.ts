import { Subjects, Publisher, RoleDeletedEvent } from "@gams/utility";

/**
 * A publisher that publishes `PersonnelCreatedEvent` events to the 'role:deleted' subject.
 */
export class RoleDeletedPublisher extends Publisher<RoleDeletedEvent> {
  /**
   * The overidden subject that the publisher publishes events to equal to 'role:deleted'.
   */
  subject: Subjects.RoleDeleted = Subjects.RoleDeleted;
}
