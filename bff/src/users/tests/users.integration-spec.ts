import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { StudyPlan } from '../../studyPlan/entities/studyPlan.entity';
import { StudyMaterial } from '../../studyMaterial/entities/studyMaterial.entity';

describe('UsersService (integration)', () => {
  let service: UsersService;
  let userId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, StudyPlan, StudyMaterial],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criar um usuário', async () => {
    const user = await service.create({
      name: 'Usuário Integração',
      email: 'teste@integ.com',
      password: '123456',
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('teste@integ.com');
    userId = user.id;
  });

  it('deve buscar todos os usuários', async () => {
    const users = await service.findAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('deve buscar usuário por ID', async () => {
    const user = await service.findOne(userId);
    expect(user.id).toBe(userId);
  });

  it('deve atualizar o usuário', async () => {
    const updated = await service.update(userId, {
      name: 'Usuário Atualizado',
    });
    expect(updated.name).toBe('Usuário Atualizado');
  });

  it('deve remover (soft delete) o usuário', async () => {
    await service.remove(userId);
    await expect(service.findOne(userId)).rejects.toThrow();
  });
});
