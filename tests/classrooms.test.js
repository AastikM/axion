require('./setup');
const request = require('supertest');
const app = require('../server'); 

describe('Classrooms API', () => {
  let token, schoolId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'superadmin', password: 'password123' });

    token = loginResponse.body.token;

    const schoolResponse = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test School', address: '123 Main St' });

    console.log('School Response:', schoolResponse.body); 
    schoolId = schoolResponse.body._id || schoolResponse.body.newSchool?._id; 
  });

  it('should create a classroom for a school', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Classroom A',
        capacity: 30,
        resources: ['Projector'],
        schoolId,
      });
  
    console.log('Response:', response.body);
    expect(response.status).toBe(201);
    expect(response.body.classroom).toHaveProperty('_id'); 
  });

  it('should fetch all classrooms for a school', async () => {
    const response = await request(app)
      .get(`/api/classrooms/${schoolId}`)
      .set('Authorization', `Bearer ${token}`);
  
    console.log('Classrooms Fetch Response:', response.body); 
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.classrooms)).toBe(true); 
  });
});