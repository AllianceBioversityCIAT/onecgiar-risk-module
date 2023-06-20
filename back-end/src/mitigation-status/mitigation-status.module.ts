import { Module } from '@nestjs/common';
import { MitigationStatusController } from './mitigation-status.controller';
import { MitigationStatusService } from './mitigation-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MitigationStatus } from 'entities/mitigation-status.entity';
@Module({
  controllers: [MitigationStatusController],
  providers: [MitigationStatusService],
  imports: [TypeOrmModule.forFeature([MitigationStatus])]
})
export class MitigationStatusModule {}
