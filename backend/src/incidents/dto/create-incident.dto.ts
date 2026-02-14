import { IsObject, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsString()
<<<<<<< HEAD
  type: string;

  @IsOptional()
  @IsObject()
  coordinates: any;
=======
  type!: string;

  @IsOptional()
  @IsObject()
  coordinates?: any;
>>>>>>> origin/001-create-frontend
}

export class CreateIncidentDto {
  @ValidateNested()
  @Type(() => PointDto)
<<<<<<< HEAD
  location: PointDto;
=======
  location!: PointDto;
>>>>>>> origin/001-create-frontend

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  properties?: any;
}
