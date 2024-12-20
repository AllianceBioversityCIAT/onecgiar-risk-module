import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from 'entities/program.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { ProgramModule } from 'src/program/program.module';
import { SharedModule } from 'src/shared/shared.module';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';
import { EmailsModule } from 'src/emails/emails.module';
import { Email } from 'src/emails/email.entity';
import { User } from 'entities/user.entitiy';
import { Variables } from 'entities/variables.entity';
import { EmailsService } from 'src/emails/emails.service';
import { VariablesService } from 'src/variables/variables.service';
import { UsersService } from 'src/users/users.service';
import { ProgramRoles } from 'entities/program-roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CollectedEmail } from 'entities/collected-emails.entity';
import { Phase } from 'entities/phase.entity';

@Module({
  controllers: [RiskController],
  imports: [
    EmailsModule,
    TypeOrmModule.forFeature([
      Risk,
      Mitigation,
      Program,
      Email,
      Variables,
      User,
      ProgramRoles,
      CollectedEmail,
      Phase
    ]),
    SharedModule,
    AuthModule,
  ],
  providers: [RiskService, EmailsService, VariablesService, UsersService],
  exports: [RiskService],
})
export class RiskModule {}
