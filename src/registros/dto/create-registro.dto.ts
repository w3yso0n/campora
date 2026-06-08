import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateRegistroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  municipio: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}
