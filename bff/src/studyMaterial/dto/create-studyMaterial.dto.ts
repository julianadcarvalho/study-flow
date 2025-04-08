import { IsNotEmpty, IsUrl, IsEnum } from 'class-validator';

export enum StudyMaterialType {
  BOOK = 'livro',
  VIDEO = 'vídeo',
  PODCAST = 'podcast',
  ARTICLE = 'artigo',
}

export enum StudyMaterialStatus {
  PENDING = 'pendente',
  COMPLETED = 'concluído',
}

export class CreateStudyMaterialDto {
  @IsNotEmpty()
  planoId: number;

  @IsNotEmpty()
  @IsEnum(StudyMaterialType)
  tipo: StudyMaterialType;

  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsEnum(StudyMaterialStatus)
  status: StudyMaterialStatus;
}
