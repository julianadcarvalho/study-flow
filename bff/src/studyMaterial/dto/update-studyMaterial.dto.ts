import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyMaterialDto } from './create-studyMaterial.dto';

export class UpdateStudyMaterialDto extends PartialType(
  CreateStudyMaterialDto,
) {}
