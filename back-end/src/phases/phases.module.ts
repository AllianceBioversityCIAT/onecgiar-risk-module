import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesController } from './phases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phase } from 'entities/phase.entity';
import { Program } from 'entities/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phase, Program])],
  controllers: [PhasesController],
  providers: [PhasesService],
  exports: [PhasesService],
})
export class PhasesModule {}
