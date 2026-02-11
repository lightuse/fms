import { IsObject, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  coordinates: any;
}

export class CreateIncidentDto {
  @ValidateNested()
  @Type(() => PointDto)
  location: PointDto;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  properties?: any;
}
