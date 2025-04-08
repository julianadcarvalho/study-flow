import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('StudyMaterialController (e2e)', () => {
  let app: INestApplication;

  let createdStudyPlanId: number;
  let createdMaterialId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const studyPlanRes = await request(app.getHttpServer())
      .post('/study-plans')
      .send({
        name: 'Plano de Teste',
        description: 'Plano para material',
        user_id: 1,
        start_date: '2025-04-01',
        end_date: '2025-04-10',
        status: 'pending',
      });

    createdStudyPlanId = studyPlanRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /study-materials → deve criar material de estudo', async () => {
    const response = await request(app.getHttpServer())
      .post('/study-materials')
      .send({
        planoId: createdStudyPlanId,
        tipo: 'vídeo',
        titulo: 'Material Teste',
        url: 'https://exemplo.com',
        status: 'pendente',
      })
      .expect(201);

    createdMaterialId = response.body.id;
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe('Material Teste');
  });

  it('GET /study-materials → deve listar os materiais de estudo', async () => {
    const response = await request(app.getHttpServer())
      .get('/study-materials')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /study-materials/:id → deve buscar material por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/study-materials/${createdMaterialId}`)
      .expect(200);

    expect(response.body.id).toBe(createdMaterialId);
  });

  it('PATCH /study-materials/:id → deve atualizar material', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/study-materials/${createdMaterialId}`)
      .send({ status: 'feito' })
      .expect(200);

    expect(response.body.status).toBe('feito');
  });

  it('DELETE /study-materials/:id → deve remover material', async () => {
    await request(app.getHttpServer())
      .delete(`/study-materials/${createdMaterialId}`)
      .expect(200);
  });
});
