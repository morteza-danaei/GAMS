import request from "supertest";

import { Listener, Subjects } from "@gams/utility";
import { Message, Stan } from "node-nats-streaming";
import { RoleCreatedListener } from "../helpers/event/role-created-listener";
import { app } from "../app";
import { Role } from "../models/role.model";

jest.mock("node-nats-streaming");

describe("RoleCreatedListener", () => {
  it("should invoke onMessage when a message is received", () => {});

  it("should handle Role:created message", async () => {
    // 1. Publish a role:created message
    const cookie = await global.signin();
    const res = await fetch("https://localhost/api/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie[0],
        // Add any necessary headers, e.g., authentication headers
      },
      body: JSON.stringify({ name: "some" }),
    });
    if (res.ok) {
      const responseData = await res.json();
      console.log("Success:", responseData);
    } else {
      const errorData = await res.json(); // or response.text() depending on the response content type
      console.error("Error:", errorData);
    }
  });
});
