import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { InitiativeModule } from 'src/initiative/initiative.module';
import { SharedModule } from 'src/shared/shared.module';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

@Module({
  controllers: [RiskController],
  imports: [TypeOrmModule.forFeature([Risk,Mitigation,Initiative]), SharedModule],
  providers: [RiskService],
  exports:[RiskService]
})
export class RiskModule {}
