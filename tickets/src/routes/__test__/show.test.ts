import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("return a ticket when ticket does not found", async () => {
  // const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get("/api/tickets/dczsbfhrvsresrgt").send().expect(404);
  //  console.log(response.body);
});

it("return a ticket when ticket found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "aasddew",
      price: 20,
    })
    .expect(201);

  const Ticketresponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  //  console.log(Ticketresponse);
});
