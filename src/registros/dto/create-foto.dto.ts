import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFotoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  base64: string;
}
