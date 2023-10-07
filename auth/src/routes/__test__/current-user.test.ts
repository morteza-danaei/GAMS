import request from "supertest";
import { app } from "../../app";

it("returns 200 when a user is signed in", async () => {
  const cookie = await global.signin();
  await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);
});

it("returns 400 when cookie is tampered/invalid", async () => {
  const cookie = await global.signin();
  await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", "fsadfsdfsadfsa")
    .expect(400);
});
