import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
/**
 * Defines the structure of an event.
 * @interface
 */
interface Event {
    subject: Subjects;
    data: any;
}
/**
 * Abstract class for creating NATS streaming server event listeners.
 * @abstract
 * @class Listener
 * @template T - The type of event to listen for.
 */
export declare abstract class Listener<T extends Event> {
    /**
     * The subject the listener will listen to.
     * @member {Subjects} Listener#subject
     */
    abstract subject: T["subject"];
    /**
     * The name of the queue group this listener will join.
     * @member {string} Listener#queueGroupName
     */
    abstract queueGroupName: string;
    /**
     * The function that will be called whenever an event is received.
     * @abstract
     * @method Listener#onMessage
     * @param {T["data"]} data - The data of the received event.
     * @param {Message} msg - The NATS streaming server message object.
     */
    abstract onMessage(data: T["data"], msg: Message): void;
    /**
     * The NATS streaming server client instance.
     * @member {Stan} Listener#client
     * @protected
     */
    protected client: Stan;
    /**
     * The duration (in milliseconds) the server should wait for an acknowledgment from the listener.
     * @member {number} Listener#ackWait
     * @protected
     */
    protected ackWait: number;
    /**
     * Creates an instance of Listener.
     * @constructor
     * @param {Stan} client - The NATS streaming server client instance.
     */
    constructor(client: Stan);
    /**
     * Returns the subscription options for the listener.
     * @method Listener#subscriptionOptions
     * @returns {Object} Subscription options for the listener.
     */
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    /**
     * Sets up the listener to listen for events.
     * @method Listener#listen
     */
    listen(): void;
    /**
     * Parses the received message data.
     * @method Listener#parseMessage
     * @param {Message} msg - The NATS streaming server message object.
     * @returns {any} Parsed message data.
     */
    parseMessage(msg: Message): any;
}
export {};
