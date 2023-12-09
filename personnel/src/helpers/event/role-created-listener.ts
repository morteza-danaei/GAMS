import { Message } from "node-nats-streaming";
import { Subjects, Listener, RoleCreatedEvent } from "@gams/utility";
import { Role } from "../../models/role.model";

/**
 * Listener class for handling "RoleCreated" events.
 * @class RoleCreatedListener
 * @extends Listener<RoleCreatedEvent>
 */
export class RoleCreatedListener extends Listener<RoleCreatedEvent> {
  /**
   * The subject this listener will listen to.
   * @member {Subjects.RoleCreated} RoleCreatedListener#subject
   */
  subject: Subjects.RoleCreated = Subjects.RoleCreated;

  /**
   * The name of the queue group this listener will join.
   * @member {string} RoleCreatedListener#queueGroupName
   */
  queueGroupName = "role-service";

  /**
   * Handles the logic when a "RoleCreated" event is received.
   * @async
   * @method RoleCreatedListener#onMessage
   * @param {RoleCreatedEvent["data"]} data - The data of the received event.
   * @param {Message} msg - The NATS streaming server message object.
   * @returns {Promise<void>} A Promise that resolves when the processing is complete.
   */
  async onMessage(data: RoleCreatedEvent["data"], msg: Message): Promise<void> {
    const { name } = data;

    // Build a new Role instance
    const role = Role.build({
      name,
    });

    await role.save();

    // Acknowledge the message manually
    msg.ack();
  }
}
