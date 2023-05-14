import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

@Module({
  controllers: [RiskController],
  imports: [TypeOrmModule.forFeature([Risk,Mitigation]), SharedModule],
  providers: [RiskService],
  exports:[RiskService]
})
export class RiskModule {}
