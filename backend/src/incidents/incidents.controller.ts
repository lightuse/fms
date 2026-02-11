
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly svc: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'List incidents for tenant' })
  @ApiResponse({ status: 200, description: 'List of incidents' })
  async list() {
    return this.svc.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create an incident' })
  @ApiResponse({ status: 201, description: 'Created incident' })
  async create(@Body() body: CreateIncidentDto) {
    return this.svc.create(body);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign units to an incident' })
  async assign(@Param('id') id: string, @Body() body: { unitIds: string[]; actorId?: string }) {
    return this.svc.assignUnits(id, body.unitIds, body.actorId);
  }
}
