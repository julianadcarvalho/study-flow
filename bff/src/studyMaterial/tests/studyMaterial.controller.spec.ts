import { Test, TestingModule } from '@nestjs/testing';
import { StudyMaterialController } from '../studyMaterial.controller';
import { StudyMaterialService } from '../studyMaterial.service';
import { StudyMaterial } from '../entities/studyMaterial.entity';
import {
  CreateStudyMaterialDto,
  StudyMaterialStatus,
  StudyMaterialType,
} from '../dto/create-studyMaterial.dto';
import { UpdateStudyMaterialDto } from '../dto/update-studyMaterial.dto';

describe('StudyMaterialController', () => {
  let controller: StudyMaterialController;
  let service: jest.Mocked<StudyMaterialService>;

  const mockStudyMaterial: StudyMaterial = {
    id: 1,
    titulo: 'Material 1',
    tipo: 'vídeo',
    url: 'https://youtube.com',
    status: 'pendente',
    planoId: 1,
    studyPlan: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyMaterialController],
      providers: [
        {
          provide: StudyMaterialService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockStudyMaterial),
            findAll: jest.fn().mockResolvedValue([mockStudyMaterial]),
            findOne: jest.fn().mockResolvedValue(mockStudyMaterial),
            update: jest.fn().mockResolvedValue({
              ...mockStudyMaterial,
              titulo: 'Atualizado',
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<StudyMaterialController>(StudyMaterialController);
    service = module.get(StudyMaterialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created study material', async () => {
      const dto: CreateStudyMaterialDto = {
        titulo: 'Novo Material',
        url: 'https://exemplo.com',
        planoId: 1,
        tipo: StudyMaterialType.BOOK,
        status: StudyMaterialStatus.PENDING,
      };

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockStudyMaterial);
    });
  });

  describe('findAll', () => {
    it('should return an array of study materials', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockStudyMaterial]);
    });
  });

  describe('findOne', () => {
    it('should return a study material by id', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStudyMaterial);
    });
  });

  describe('update', () => {
    it('should update a study material and return the updated object', async () => {
      const dto: UpdateStudyMaterialDto = { titulo: 'Atualizado' };
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.titulo).toBe('Atualizado');
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
