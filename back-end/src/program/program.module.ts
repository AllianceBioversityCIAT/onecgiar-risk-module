import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramRoles } from 'entities/program-roles.entity';
import { Program } from 'entities/program.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RiskModule } from 'src/risk/risk.module';
import { RiskService } from 'src/risk/risk.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { EmailsService } from 'src/emails/emails.service';
import { Email } from 'src/emails/email.entity';
import { User } from 'entities/user.entitiy';
import { Variables } from 'entities/variables.entity';
import { VariablesService } from 'src/variables/variables.service';
import { ActionArea } from 'entities/action-area';
import { PhasesService } from 'src/phases/phases.service';
import { Phase } from 'entities/phase.entity';
import { CollectedEmail } from 'entities/collected-emails.entity';
import { Archive } from 'entities/archive.entity';
import { Organization } from 'entities/organization.entity';
import { PhaseProgramOrganization } from 'entities/phase-program-organization.entity';
@Global()
@Module({
  controllers: [ProgramController],
  imports: [
    TypeOrmModule.forFeature([
      Program,
      ProgramRoles,
      Risk,
      Mitigation,
      Email,
      User,
      Variables,
      ActionArea,
      Phase,
      CollectedEmail,
      Archive,
      Organization,
      PhaseProgramOrganization
    ]),
    SharedModule,
    RiskModule,
    UsersModule,
    AuthModule
  ],
  providers: [ProgramService, RiskService, EmailsService, VariablesService, PhasesService],
  exports:[ProgramService,RiskService]
})
export class ProgramModule {}
