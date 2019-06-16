const request = require('supertest');
const app = require('../../app');

describe('Index Route', () => {
  it('displays the correct summary', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200);
    expect(response.text).toMatchSnapshot();
  });
});
