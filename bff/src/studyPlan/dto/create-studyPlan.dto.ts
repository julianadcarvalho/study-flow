import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum StudyPlanStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class CreateStudyPlanDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user_id: number;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(StudyPlanStatus)
  status?: string;
}
