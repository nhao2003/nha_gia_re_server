import request from 'supertest';
import app from '../../src/app/app';
import {AppDataSource} from '../../src/app/database';
describe('App', () => {
  beforeAll(() => {
    AppDataSource.initialize();
  });


  it('should return 200 OK when requesting the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return "Hello, world!" when requesting the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello, world!');
  });
});