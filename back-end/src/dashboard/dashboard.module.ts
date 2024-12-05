import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ProgramModule } from 'src/program/program.module';
@Module({
  controllers: [DashboardController],
  imports: [ProgramModule],
})
export class DashboardModule {}
