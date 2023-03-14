import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { SharedModule } from 'src/shared/shared.module';
import { InitiativeController } from './initiative.controller';
import { InitiativeService } from './initiative.service';

@Module({
  controllers: [InitiativeController],
  imports: [TypeOrmModule.forFeature([Initiative,InitiativeRoles]), SharedModule],
  providers: [InitiativeService],
})
export class InitiativeModule {}
