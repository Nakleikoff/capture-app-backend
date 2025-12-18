import request from 'supertest';
import { app } from '../src/app.js';
import Teammate from '../src/models/teammate.js';
import { jest } from "@jest/globals";


// Ensure DB is clean after each test
afterEach(async () => {
  await Teammate.destroy({where: {}, truncate: true });
});

describe('teammateController: Positive Tests', () => {
  
  test('POST /api/teammates should create a teammate', async () => {
    
    const payload = { name: 'Atest User' };
  console.log('Sending payload:', payload);
    
    const response = await request(app)
      .post('/api/teammates')
      .send(payload);

 console.log('Response status:', response.statusCode);
  console.log('Response body:', response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Atest User');
  });

test('GET /api/teammates should return single teammate', async () => {
    // Seed some records
    await Teammate.create({ name: 'Single Teammate' });

    const response = await request(app).get('/api/teammates');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].name).toBe('Single Teammate');
  });

  test('GET /api/teammates should return all teammates', async () => {
    // Seed some records
    await Teammate.create({ name: 'John Doe' });
    await Teammate.create({ name: 'Jane Doe' });
    await Teammate.create({ name: 'Jake Doe' });

    const response = await request(app).get('/api/teammates');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(3);
    expect(response.body.data[0].name).toBe('John Doe');
    expect(response.body.data[1].name).toBe('Jane Doe');
    expect(response.body.data[2].name).toBe('Jake Doe');
  });
});

describe('teammateController: Negative Tests', () => {

  test('POST /api/teammates should throw notNull Violation when name is null', async () => {
    const response = await request(app)
      .post('/api/teammates')
      .send({ name: null });
    
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('notNull Violation: Teammate.name cannot be null');
  });

  test('POST /api/teammates DB Down', async () => {

jest.spyOn(Teammate, "create").mockRejectedValue(new Error("DB down"));
    
    const response = await request(app)
      .post('/api/teammates')
      .send({ name: 'Atest User' });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('DB down'); // We will need the actual error message here

     Teammate.create.mockRestore();

  });
});
