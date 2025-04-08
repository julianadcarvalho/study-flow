import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlanService } from '../studyPlan.service';
import { User } from '../../users/entities/user.entity';
import { StudyPlan } from '../entities/studyPlan.entity';
import { StudyMaterial } from '../../studyMaterial/entities/studyMaterial.entity';
import { StudyPlanController } from '../studyPlan.controller';

describe('StudyPlan Integration', () => {
  let service: StudyPlanService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, StudyPlan, StudyMaterial],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([StudyPlan]),
      ],
      controllers: [StudyPlanController],
      providers: [StudyPlanService],
    }).compile();

    service = module.get<StudyPlanService>(StudyPlanService);
  });

  let createdPlanId: number;

  it('deve criar um plano de estudo', async () => {
    const plan = await service.create({
      name: 'Plano Integração',
      description: 'Teste de integração',
      user_id: 1,
      start_date: new Date('2025-04-01').toISOString(),
      end_date: '2025-04-10',
      status: 'pending',
    });

    createdPlanId = plan.id;
    expect(plan).toHaveProperty('id');
    expect(plan.name).toBe('Plano Integração');
  });

  it('deve buscar todos os planos', async () => {
    const plans = await service.findAll();
    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
  });

  it('deve buscar um plano por ID', async () => {
    const plan = await service.findOne(createdPlanId);
    expect(plan.id).toBe(createdPlanId);
  });

  it('deve atualizar o plano', async () => {
    const updated = await service.update(createdPlanId, {
      status: 'done',
    });

    expect(updated.status).toBe('done');
  });

  it('deve remover o plano', async () => {
    await service.remove(createdPlanId);

    await expect(service.findOne(createdPlanId)).rejects.toThrow();
  });
});
