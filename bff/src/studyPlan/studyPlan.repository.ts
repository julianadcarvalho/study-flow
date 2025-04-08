import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StudyPlan } from './entities/studyPlan.entity';

@Injectable()
export class StudyPlanRepository extends Repository<StudyPlan> {
  constructor(private dataSource: DataSource) {
    super(StudyPlan, dataSource.createEntityManager());
  }
}
