import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { deleted_at: null },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async findOne(id: number): Promise<User> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar usuário.');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    try {
      const user = await this.findOne(id);
      const updatedUser = Object.assign(user, updateUserDto);
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    try {
      const result = await this.userRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar usuário.');
    }
  }
}
