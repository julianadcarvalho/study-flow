import { IsOptional, IsEnum, IsDateString } from 'class-validator';

export class UpdateStudyPlanDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: string;
}
