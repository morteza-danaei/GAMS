import request from "supertest";
import { app } from "../../app";

it("returns 200 when a user is signed in", async () => {
  await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", await global.signin())
    .expect(200);
});

it("returns 400 when cookie is tampered/invalid", async () => {
  await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", "fsadfsdfsadfsa")
    .expect(400);
});
