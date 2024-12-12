import request from 'supertest';
import app from '../../src/server';

describe('Integration Tests - Schedules', () => {
  it('should retrieve all schedules', async () => {
    const response = await request(app).get('/api/schedules');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
