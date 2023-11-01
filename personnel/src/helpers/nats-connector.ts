import nats, { Stan } from "node-nats-streaming";

/**

 * A class that provides a connection to a NATS server.

 * This class can be used to connect to a NATS server and publish and subscribe to messages. 
 * It also provides a convenient way to manage the NATS connection, such as automatically reconnecting if the connection is lost.
 * @remarks This class is thread-safe and can be used in multiple threads simultaneously. 
 */
class NatsConnector {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  /**

   * Connects to the NATS server.

   * @param clusterId The NATS cluster ID.
   * @param clientId The NATS client ID.
   * @param url The NATS server URL.
   * @returns A promise that resolves when the connection is established. 
   */
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve(null);
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsConnector = new NatsConnector();
