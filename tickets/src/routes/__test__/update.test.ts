import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  // const id =new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/efsrtgsr`)
    .set("Cookie", await global.signin())
    .send({
      title: "eedfsersr",
      price: 50,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put("/api/tickets/srtgrt")
    .send({
      title: "eedfsersr",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({
      title: "rfserf",
      price: 50,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await global.signin())
    .send({
      title: "frer",
      price: 2000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid ticket or price", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({
      title: "aasddew",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await global.signin())
    .send({
      price: 50,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await global.signin())
    .send({
      title: "",
    })
    .expect(400);
});

it("returns a 200 updates a ticket ", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "aasddew",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "bhiol",
      price: 200,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("bhiol");
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 });
  //Try to update:
  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test 123", price: 99 })
    .expect(400);
});
