import { Controller, Get, Query } from '@nestjs/common';
import { UnitsService } from './units.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly svc: UnitsService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby available units' })
  async nearby(@Query('lat') lat: string, @Query('lon') lon: string, @Query('radius') radius?: string) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const r = radius ? parseFloat(radius) : 5;
    return this.svc.findNearby(latNum, lonNum, r);
  }
}

export default UnitsController;
