import { Module } from '@nestjs/common';
import { MitigationStatusController } from './mitigation-status.controller';
import { MitigationStatusService } from './mitigation-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MitigationStatus } from 'entities/mitigation-status.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [MitigationStatusController],
  providers: [MitigationStatusService],
  imports: [TypeOrmModule.forFeature([MitigationStatus]), AuthModule],
})
export class MitigationStatusModule {}
