import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from './entities/studyPlan.entity';
import { CreateStudyPlanDto } from './dto/create-studyPlan.dto';
import { UpdateStudyPlanDto } from './dto/update-studyPlan.dto';

@Injectable()
export class StudyPlanService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
  ) {}

  async create(createStudyPlanDto: CreateStudyPlanDto): Promise<StudyPlan> {
    const studyPlan = this.studyPlanRepository.create(createStudyPlanDto);
    return await this.studyPlanRepository.save(studyPlan);
  }

  async findAll(): Promise<StudyPlan[]> {
    return await this.studyPlanRepository.find({ relations: ['materials'] });
  }

  async findOne(id: number): Promise<StudyPlan> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID inválido.');
    }

    try {
      const studyPlan = await this.studyPlanRepository.findOne({
        where: { id },
        relations: ['materials'],
      });
      if (!studyPlan) {
        throw new NotFoundException(
          `Plano de estudo com ID ${id} não encontrado.`,
        );
      }
      return studyPlan;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar plano de estudo.');
    }
  }

  async update(
    id: number,
    updateStudyPlanDto: UpdateStudyPlanDto,
  ): Promise<StudyPlan> {
    const studyPlan = await this.findOne(id);
    Object.assign(studyPlan, updateStudyPlanDto);
    return await this.studyPlanRepository.save(studyPlan);
  }

  async remove(id: number): Promise<void> {
    await this.studyPlanRepository.softDelete(id);
  }
}
