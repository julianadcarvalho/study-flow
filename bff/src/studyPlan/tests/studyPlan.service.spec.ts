import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StudyPlan } from '../entities/studyPlan.entity';
import { StudyPlanService } from '../studyPlan.service';

describe('StudyPlanService', () => {
  let service: StudyPlanService;
  let repo: jest.Mocked<Repository<StudyPlan>>;

  const mockStudyPlan = {
    id: 1,
    name: 'Plano JavaScript',
    description: 'Estudo de JS',
    user_id: 1,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'pending',
    materials: [],
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockStudyPlan),
    save: jest.fn().mockResolvedValue(mockStudyPlan),
    find: jest.fn().mockResolvedValue([mockStudyPlan]),
    findOne: jest.fn().mockResolvedValue(mockStudyPlan),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyPlanService,
        {
          provide: getRepositoryToken(StudyPlan),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<StudyPlanService>(StudyPlanService);
    repo = module.get(getRepositoryToken(StudyPlan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a study plan', async () => {
      const dto = { ...mockStudyPlan };
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockStudyPlan);
      expect(result).toEqual(mockStudyPlan);
    });
  });

  describe('findAll', () => {
    it('should return all study plans with materials', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ relations: ['materials'] });
      expect(result).toEqual([mockStudyPlan]);
    });
  });

  describe('findOne', () => {
    it('should return a study plan by id', async () => {
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['materials'],
      });
      expect(result).toEqual(mockStudyPlan);
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if study plan not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save a study plan', async () => {
      const dto = { name: 'Novo nome' };
      const result = await service.update(1, dto);
      expect(result).toEqual({ ...mockStudyPlan, name: 'Novo nome' });
      expect(repo.save).toHaveBeenCalledWith({
        ...mockStudyPlan,
        name: 'Novo nome',
      });
    });
  });

  describe('remove', () => {
    it('should call softDelete with correct id', async () => {
      await service.remove(1);
      expect(repo.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
