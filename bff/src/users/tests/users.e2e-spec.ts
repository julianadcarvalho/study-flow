import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) deve criar um usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Alice', email: 'alice@email.com' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Alice');
  });

  it('/users (GET) deve retornar todos os usuários', async () => {
    const response = await request(app.getHttpServer()).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id (GET) deve retornar um usuário específico', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Bob', email: 'bob@email.com' });

    const id = createRes.body.id;

    const response = await request(app.getHttpServer()).get(`/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Bob');
  });

  it('/users/:id (PATCH) deve atualizar um usuário', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@email.com' });

    const id = createRes.body.id;

    const response = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ name: 'Charlie Updated' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Charlie Updated');
  });

  it('/users/:id (DELETE) deve remover um usuário', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Delete Me', email: 'deleteme@email.com' });

    const id = createRes.body.id;

    const deleteResponse = await request(app.getHttpServer()).delete(
      `/users/${id}`,
    );
    expect(deleteResponse.status).toBe(200);
  });
});
