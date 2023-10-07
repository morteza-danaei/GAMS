import request from "supertest";
import { app } from "../../app";

it(" sends an an empty object when sign out", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/users/signout")
    .set("Cookie", cookie)
    .expect(200, {});
});
