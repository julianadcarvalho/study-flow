import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyMaterialService } from '../studyMaterial.service';
import { User } from '../../users/entities/user.entity';
import { StudyPlan } from '../../studyPlan/entities/studyPlan.entity';
import { StudyMaterial } from '../entities/studyMaterial.entity';
import {
  StudyMaterialStatus,
  StudyMaterialType,
} from '../dto/create-studyMaterial.dto';

describe('StudyMaterialService (integration)', () => {
  let service: StudyMaterialService;
  let materialId: number;
  let planId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, StudyPlan, StudyMaterial],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([StudyMaterial, StudyPlan]),
      ],
      providers: [StudyMaterialService],
    }).compile();

    const planRepo = module.get('StudyPlanRepository') as any;
    const createdPlan = await planRepo.save({
      name: 'Plano Teste',
      description: 'Para testes de material',
      user_id: 1,
      start_date: new Date(),
      end_date: new Date(),
      status: 'pending',
    });
    planId = createdPlan.id;

    service = module.get<StudyMaterialService>(StudyMaterialService);
  });

  it('deve criar um material de estudo', async () => {
    const material = await service.create({
      planoId: planId,
      titulo: 'Aula NestJS',
      url: 'https://youtube.com',
      tipo: StudyMaterialType.BOOK,
      status: StudyMaterialStatus.PENDING,
    });

    expect(material).toHaveProperty('id');
    expect(material.titulo).toBe('Aula NestJS');
    materialId = material.id;
  });

  it('deve buscar todos os materiais', async () => {
    const materials = await service.findAll();
    expect(materials.length).toBeGreaterThan(0);
  });

  it('deve buscar um material por ID', async () => {
    const material = await service.findOne(materialId);
    expect(material.id).toBe(materialId);
  });

  it('deve atualizar um material', async () => {
    const updated = await service.update(materialId, {
      status: StudyMaterialStatus.COMPLETED,
    });

    expect(updated.status).toBe('concluído');
  });

  it('deve remover o material', async () => {
    await service.remove(materialId);
    await expect(service.findOne(materialId)).rejects.toThrow();
  });
});
