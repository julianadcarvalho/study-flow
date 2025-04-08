import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudyMaterial } from '../entities/studyMaterial.entity';
import { StudyMaterialService } from '../studyMaterial.service';
import {
  StudyMaterialStatus,
  StudyMaterialType,
} from '../dto/create-studyMaterial.dto';

describe('StudyMaterialService', () => {
  let service: StudyMaterialService;
  let repo: jest.Mocked<Repository<StudyMaterial>>;

  const mockStudyMaterial: StudyMaterial = {
    id: 1,
    titulo: 'Título do Material',
    tipo: 'vídeo',
    url: 'https://youtube.com/teste',
    status: StudyMaterialStatus.PENDING,
    planoId: 1,
    studyPlan: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudyMaterialService,
        {
          provide: getRepositoryToken(StudyMaterial),
          useValue: {
            create: jest.fn().mockReturnValue(mockStudyMaterial),
            save: jest.fn().mockResolvedValue(mockStudyMaterial),
            find: jest.fn().mockResolvedValue([mockStudyMaterial]),
            findOne: jest.fn().mockResolvedValue(mockStudyMaterial),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<StudyMaterialService>(StudyMaterialService);
    repo = module.get(getRepositoryToken(StudyMaterial));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a study material', async () => {
      const result = await service.create({
        titulo: 'Material 1',
        url: 'https://example.com',
        status: StudyMaterialStatus.PENDING,
        planoId: 1,
        tipo: StudyMaterialType.BOOK,
      });
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockStudyMaterial);
    });
  });

  describe('findAll', () => {
    it('should return a list of study materials', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ relations: ['studyPlan'] });
      expect(result).toEqual([mockStudyMaterial]);
    });
  });

  describe('findOne', () => {
    it('should return a study material by id', async () => {
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['studyPlan'],
      });
      expect(result).toEqual(mockStudyMaterial);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if material not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      repo.findOne.mockRejectedValueOnce(new Error('Unexpected error'));
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the study material', async () => {
      const result = await service.update(1, { titulo: 'Atualizado' });
      expect(result).toEqual({ ...mockStudyMaterial, titulo: 'Atualizado' });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the study material', async () => {
      await service.remove(1);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if material not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
