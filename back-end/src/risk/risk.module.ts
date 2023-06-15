import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { InitiativeModule } from 'src/initiative/initiative.module';
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

@Module({
  controllers: [RiskController],
  imports: [
    EmailsModule,
    TypeOrmModule.forFeature([
      Risk,
      Mitigation,
      Initiative,
      Email,
      Variables,
      User,
    ]),
    SharedModule,
  ],
  providers: [RiskService, EmailsService, VariablesService, UsersService],
  exports: [RiskService],
})
export class RiskModule {}
