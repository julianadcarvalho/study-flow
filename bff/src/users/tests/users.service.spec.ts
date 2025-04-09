import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(mockUser);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error on create failure', async () => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.create(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });

    it('should throw error on failure', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error());
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequest for invalid ID', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFound if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerError on query error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updatedUser = { ...mockUser, name: 'Updated' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw error on save failure', async () => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.update(1, { name: 'Fail' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the user', async () => {
      await service.remove(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFound if user not affected', async () => {
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw error on delete failure', async () => {
      jest.spyOn(repository, 'softDelete').mockRejectedValueOnce(new Error());
      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
