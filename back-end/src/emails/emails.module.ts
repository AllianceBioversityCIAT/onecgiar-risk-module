import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { VariablesModule } from 'src/variables/variables.module';
import { Variables } from 'entities/variables.entity';
import { User } from 'entities/user.entitiy';
import { UsersModule } from 'src/users/users.module';
import { sciencePrograms } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { scienceProgramsRoles } from 'entities/initiative-roles.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CollectedEmail } from 'entities/collected-emails.entity';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [
    VariablesModule,
    UsersModule,
    TypeOrmModule.forFeature([
      Email,
      Variables,
      User,
      sciencePrograms,
      Risk,
      scienceProgramsRoles,
      CollectedEmail
    ]),
    AuthModule,
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
