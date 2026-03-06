import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  return request(app)
    .post('/api/tickets')
    .set("Cookie", await global.signin())
    .send({
      title: "asldkf",
      price: 20
    })
};


it('anyone can fetch list of tickets', async()=>{
    await createTicket()
    await createTicket()
    await createTicket()

    const resp = await request(app)
      .get('/api/tickets')
      .send()
      .expect(200)

    expect(resp.body.length).toEqual(3)

})