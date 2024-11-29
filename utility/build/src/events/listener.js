"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
/**
 * Abstract class for creating NATS streaming server event listeners.
 * @abstract
 * @class Listener
 * @template T - The type of event to listen for.
 */
class Listener {
    /**
     * Creates an instance of Listener.
     * @constructor
     * @param {Stan} client - The NATS streaming server client instance.
     */
    constructor(client) {
        /**
         * The duration (in milliseconds) the server should wait for an acknowledgment from the listener.
         * @member {number} Listener#ackWait
         * @protected
         */
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    /**
     * Returns the subscription options for the listener.
     * @method Listener#subscriptionOptions
     * @returns {Object} Subscription options for the listener.
     */
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }
    /**
     * Sets up the listener to listen for events.
     * @method Listener#listen
     */
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on("message", (msg) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }
    /**
     * Parses the received message data.
     * @method Listener#parseMessage
     * @param {Message} msg - The NATS streaming server message object.
     * @returns {any} Parsed message data.
     */
    parseMessage(msg) {
        const data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf8"));
    }
}
exports.Listener = Listener;
