import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlanController } from '../studyPlan.controller';
import { StudyPlanService } from '../studyPlan.service';
import { CreateStudyPlanDto } from '../dto/create-studyPlan.dto';
import { UpdateStudyPlanDto } from '../dto/update-studyPlan.dto';

describe('StudyPlanController', () => {
  let controller: StudyPlanController;
  let service: StudyPlanService;

  const mockStudyPlan = {
    id: 1,
    name: 'Plano de JS',
    description: 'Estudo avançado de JavaScript',
    user_id: 1,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'pending',
    materials: [],
  };

  const studyPlanServiceMock = {
    create: jest.fn().mockResolvedValue(mockStudyPlan),
    findAll: jest.fn().mockResolvedValue([mockStudyPlan]),
    findOne: jest.fn().mockResolvedValue(mockStudyPlan),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockStudyPlan, name: 'Atualizado' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyPlanController],
      providers: [
        {
          provide: StudyPlanService,
          useValue: studyPlanServiceMock,
        },
      ],
    }).compile();

    controller = module.get<StudyPlanController>(StudyPlanController);
    service = module.get<StudyPlanService>(StudyPlanService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created study plan', async () => {
      const dto: CreateStudyPlanDto = {
        name: 'Plano de JS',
        description: 'Estudo avançado de JavaScript',
        user_id: 1,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: 'pending',
      };

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockStudyPlan);
    });
  });

  describe('findAll', () => {
    it('should return a list of study plans', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockStudyPlan]);
    });
  });

  describe('findOne', () => {
    it('should return a study plan by id', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStudyPlan);
    });
  });

  describe('update', () => {
    it('should update and return the study plan', async () => {
      const dto: UpdateStudyPlanDto = { name: 'Atualizado' };
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockStudyPlan, name: 'Atualizado' });
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
