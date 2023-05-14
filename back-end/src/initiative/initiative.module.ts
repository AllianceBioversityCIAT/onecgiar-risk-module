import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { RiskModule } from 'src/risk/risk.module';
import { RiskService } from 'src/risk/risk.service';
import { SharedModule } from 'src/shared/shared.module';
import { InitiativeController } from './initiative.controller';
import { InitiativeService } from './initiative.service';

@Module({
  controllers: [InitiativeController],
  imports: [TypeOrmModule.forFeature([Initiative,InitiativeRoles,Risk,Mitigation]), SharedModule,RiskModule],
  providers: [InitiativeService,RiskService],
})
export class InitiativeModule {}
