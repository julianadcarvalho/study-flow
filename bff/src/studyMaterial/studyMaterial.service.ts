import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyMaterial } from './entities/studyMaterial.entity';
import { CreateStudyMaterialDto } from './dto/create-studyMaterial.dto';
import { UpdateStudyMaterialDto } from './dto/update-studyMaterial.dto';

@Injectable()
export class StudyMaterialService {
  constructor(
    @InjectRepository(StudyMaterial)
    private readonly studyMaterialRepository: Repository<StudyMaterial>,
  ) {}

  async create(
    createStudyMaterialDto: CreateStudyMaterialDto,
  ): Promise<StudyMaterial> {
    const studyMaterial = this.studyMaterialRepository.create(
      createStudyMaterialDto,
    );
    return await this.studyMaterialRepository.save(studyMaterial);
  }

  async findAll(): Promise<StudyMaterial[]> {
    return await this.studyMaterialRepository.find({
      relations: ['studyPlan'],
    });
  }

  async findOne(id: number): Promise<StudyMaterial> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    try {
      const studyMaterial = await this.studyMaterialRepository.findOne({
        where: { id },
        relations: ['studyPlan'],
      });

      if (!studyMaterial) {
        throw new NotFoundException(
          `Material de estudo com ID ${id} não encontrado.`,
        );
      }

      return studyMaterial;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro ao buscar material de estudo.',
      );
    }
  }

  async update(
    id: number,
    updateStudyMaterialDto: UpdateStudyMaterialDto,
  ): Promise<StudyMaterial> {
    const studyMaterial = await this.findOne(id);
    Object.assign(studyMaterial, updateStudyMaterialDto);
    return await this.studyMaterialRepository.save(studyMaterial);
  }

  async remove(id: number): Promise<void> {
    const material = await this.studyMaterialRepository.findOne({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material com ID ${id} não encontrado`);
    }

    await this.studyMaterialRepository.softDelete(id);
  }
}
