import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('StudyPlanController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  it('POST /study-plans → deve criar um plano de estudo', async () => {
    const response = await request(app.getHttpServer())
      .post('/study-plans')
      .send({
        name: 'Plano de Estudo Teste',
        description: 'Testando e2e',
        user_id: 1,
        start_date: '2025-04-01',
        end_date: '2025-04-10',
        status: 'pending',
      })
      .expect(201);

    createdId = response.body.id;
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Plano de Estudo Teste');
  });

  it('GET /study-plans → deve listar os planos de estudo', async () => {
    const response = await request(app.getHttpServer())
      .get('/study-plans')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /study-plans/:id → deve buscar plano de estudo por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/study-plans/${createdId}`)
      .expect(200);

    expect(response.body.id).toBe(createdId);
  });

  it('PATCH /study-plans/:id → deve atualizar plano de estudo', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/study-plans/${createdId}`)
      .send({ status: 'done' })
      .expect(200);

    expect(response.body.status).toBe('done');
  });

  it('DELETE /study-plans/:id → deve remover plano de estudo', async () => {
    await request(app.getHttpServer())
      .delete(`/study-plans/${createdId}`)
      .expect(200);
  });
});
