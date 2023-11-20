import { Subjects, Publisher, RoleCreatedEvent } from "@gams/utility";

/**
 * A publisher that publishes `PersonnelCreatedEvent` events to the 'role:created' subject.
 */
export class RoleCreatedPublisher extends Publisher<RoleCreatedEvent> {
  /**
   * The overidden subject that the publisher publishes events to equal to 'role:created'.
   */
  subject: Subjects.RoleCreated = Subjects.RoleCreated;
}
