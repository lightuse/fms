import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { IncidentsController } from './incidents/incidents.controller';
import { IncidentsService } from './incidents/incidents.service';
<<<<<<< HEAD
=======
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';
>>>>>>> origin/001-create-frontend
import { TenantMiddleware } from './middleware/tenant.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incidents/incident.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fms',
      entities: [Incident],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Incident]),
  ],
<<<<<<< HEAD
  controllers: [IncidentsController],
  providers: [IncidentsService],
=======
  controllers: [IncidentsController, UnitsController],
  providers: [IncidentsService, UnitsService],
>>>>>>> origin/001-create-frontend
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
