import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RiskModule } from 'src/risk/risk.module';
import { RiskService } from 'src/risk/risk.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { InitiativeController } from './initiative.controller';
import { InitiativeService } from './initiative.service';
import { EmailsService } from 'src/emails/emails.service';
import { Email } from 'src/emails/email.entity';
import { User } from 'entities/user.entitiy';
import { Variables } from 'entities/variables.entity';
import { VariablesService } from 'src/variables/variables.service';

@Module({
  controllers: [InitiativeController],
  imports: [
    TypeOrmModule.forFeature([
      Initiative,
      InitiativeRoles,
      Risk,
      Mitigation,
      Email,
      User,
      Variables,
    ]),
    SharedModule,
    RiskModule,
    UsersModule,
    AuthModule,
  ],
  providers: [InitiativeService, RiskService, EmailsService, VariablesService],
})
export class InitiativeModule {}
