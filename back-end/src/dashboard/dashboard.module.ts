import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { InitiativeModule } from 'src/initiative/initiative.module';
@Module({
  controllers: [DashboardController],
  imports: [InitiativeModule],
})
export class DashboardModule {}
