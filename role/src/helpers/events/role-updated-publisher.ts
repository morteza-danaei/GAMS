import { Subjects, Publisher, RoleUpdatedEvent } from "@gams/utility";

/**
 * A publisher that publishes `RoleUpdatedEvent` events to the 'role:updated' subject.
 */
export class RoleUpdatedPublisher extends Publisher<RoleUpdatedEvent> {
  /**
   * The overidden subject that the publisher publishes events to equal to 'role:updated'.
   */
  subject: Subjects.RoleUpdated = Subjects.RoleUpdated;
}
