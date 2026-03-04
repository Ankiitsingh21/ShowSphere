import request from "supertest";
import { app } from "../../app";

it("response with details about current user", async () => {
  const cookie = await signin();
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("respond with null if not autheticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
