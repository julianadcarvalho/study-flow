import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyMaterial } from './entities/studyMaterial.entity';
import { StudyMaterialController } from './studyMaterial.controller';
import { StudyMaterialService } from './studyMaterial.service';
import { StudyMaterialRepository } from './studyMaterial.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudyMaterial])],
  controllers: [StudyMaterialController],
  providers: [StudyMaterialService, StudyMaterialRepository],
})
export class StudyMaterialModule {}
