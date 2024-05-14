import request from 'supertest';
import app from '../server';  

describe('Notification API', () => {
  it('should create a notification', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({
        event: 'EVENT_OCCURRED',
        deliveryVia: 'EMAIL',
        type: 'INSTANT',
        metadata: { email: 'test@test.com', content: 'Hello' },
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should list notifications', async () => {
    const res = await request(app).get('/notifications');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
     