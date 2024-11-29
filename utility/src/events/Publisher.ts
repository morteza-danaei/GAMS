import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

/**
 * An abstract class that provides a basic implementation for publishing events to a NATS server.
 *
 * Subclasses of the `Publisher` class must implement the `subject` property to specify the subject that they publish to.
 * The `Publisher` class provides a single method, `publish()`, which publishes an event to the publisher's subject.
 * The `publish()` method takes the data to publish as an argument and returns a promise that resolves when the event has been published.
 * The `Publisher` class is thread-safe and can be used in multiple threads simultaneously.
 *
 * @remarks To use the `Publisher` class, you must first create a NATS client and pass it to the `Publisher` constructor. Once you have a `Publisher` instance, you can call the `publish()` method to publish events.
 */
export abstract class Publisher<T extends Event> {
  /**
   * The subject that the publisher publishes events to.
   */
  abstract subject: T["subject"];

  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  /**
   * Publishes an event to the publisher's subject.
   *
   * @param data The data to publish.
   *
   * @returns A promise that resolves when the event has been published.
   */
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}