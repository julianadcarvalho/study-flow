import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlan } from './entities/studyPlan.entity';
import { StudyPlanController } from './studyPlan.controller';
import { StudyPlanService } from './studyPlan.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan])],
  controllers: [StudyPlanController],
  providers: [StudyPlanService],
  exports: [StudyPlanService],
})
export class StudyPlanModule {}
