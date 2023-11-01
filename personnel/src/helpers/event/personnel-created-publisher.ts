import { Subjects, Publisher, PersonnelCreatedEvent } from "@gams/utility";

export class PersonnelCreatedPublisher extends Publisher<PersonnelCreatedEvent> {
  subject: Subjects.PersonnelCreated = Subjects.PersonnelCreated;
}
