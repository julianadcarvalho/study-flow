import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudyPlanService } from './studyPlan.service';
import { CreateStudyPlanDto } from './dto/create-studyPlan.dto';
import { UpdateStudyPlanDto } from './dto/update-studyPlan.dto';

@Controller('study-plans')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Post()
  create(@Body() createStudyPlanDto: CreateStudyPlanDto) {
    return this.studyPlanService.create(createStudyPlanDto);
  }

  @Get()
  findAll() {
    return this.studyPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudyPlanDto: UpdateStudyPlanDto,
  ) {
    return this.studyPlanService.update(+id, updateStudyPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyPlanService.remove(+id);
  }
}
