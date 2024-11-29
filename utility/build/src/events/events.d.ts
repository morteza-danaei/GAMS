import { Subjects } from "./subjects";
/**
 * An interface that represents an event that is published when a new personnel is created.
 */
export interface PersonnelCreatedEvent {
    /**
     * The subject of the event.
     */
    subject: Subjects.PersonnelCreated;
    /**
     * The data associated with the event.
     */
    data: {
        /**
         * The personnel's National Id.
         */
        nid: string;
        /**
         * The personnel's Personnel Id.
         */
        pid: string;
        /**
         * The personnel's name.
         */
        name: string;
        /**
         * The personnel's last name.
         */
        lastname: string;
        /**
         * The personnel's department.
         */
        department: string;
    };
}
export interface PersonnelUpdatedEvent {
    subject: Subjects.PersonnelUpdated;
    data: {
        nid: string;
        pid: string;
        name: string;
        lastname: string;
        department: string;
    };
}
export interface RoleCreatedEvent {
    subject: Subjects.RoleCreated;
    data: {
        name: string;
    };
}
export interface RoleUpdatedEvent {
    subject: Subjects.RoleUpdated;
    data: {
        name: string;
    };
}
export interface RoleDeletedEvent {
    subject: Subjects.RoleDeleted;
    data: {
        id: string;
    };
}
