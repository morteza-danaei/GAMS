import { Stan } from "node-nats-streaming";

enum Subjects {
  PersonnelCreated = "Personnel:created",
}

interface Event {
  subject: Subjects;
  data: any;
}

interface PersonnelCreatedEvent {
  subject: Subjects.PersonnelCreated;
  data: {
    nid: string;
    pid: string;
    name: string;
    lastname: string;
    department: string;
  };
}

abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

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

export class PersonnelCreatedPublisher extends Publisher<PersonnelCreatedEvent> {
  subject: Subjects.PersonnelCreated = Subjects.PersonnelCreated;
}
