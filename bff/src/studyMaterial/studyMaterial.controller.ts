import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudyMaterialService } from './studyMaterial.service';
import { CreateStudyMaterialDto } from './dto/create-studyMaterial.dto';
import { UpdateStudyMaterialDto } from './dto/update-studyMaterial.dto';

@Controller('study-materials')
export class StudyMaterialController {
  constructor(private readonly studyMaterialService: StudyMaterialService) {}

  @Post()
  create(@Body() createStudyMaterialDto: CreateStudyMaterialDto) {
    return this.studyMaterialService.create(createStudyMaterialDto);
  }

  @Get()
  findAll() {
    return this.studyMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudyMaterialDto: UpdateStudyMaterialDto,
  ) {
    return this.studyMaterialService.update(+id, updateStudyMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyMaterialService.remove(+id);
  }
}
