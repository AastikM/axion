const request = require('supertest');
const app = require('../server');

describe('Schools API', () => {
  let token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'superadmin', password: 'password123' });

    token = loginResponse.body.token;
  });

  it('should create a new school', async () => {
    const response = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test School', address: '123 Main St' });

    console.log('Create School Response:', response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('newSchool');
    expect(response.body.newSchool).toHaveProperty('_id');
  });

  it('should fetch all schools', async () => {
    const response = await request(app)
      .get('/api/schools')
      .set('Authorization', `Bearer ${token}`);

    console.log('Fetch Schools Response:', response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.schools || response.body)).toBe(true);
  });
});