import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StudyMaterial } from './entities/studyMaterial.entity';

@Injectable()
export class StudyMaterialRepository extends Repository<StudyMaterial> {
  constructor(private dataSource: DataSource) {
    super(StudyMaterial, dataSource.createEntityManager());
  }
}
