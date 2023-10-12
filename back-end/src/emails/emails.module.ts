import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { VariablesModule } from 'src/variables/variables.module';
import { Variables } from 'entities/variables.entity';
import { User } from 'entities/user.entitiy';
import { UsersModule } from 'src/users/users.module';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { AuthModule } from 'src/auth/auth.module';

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
      Initiative,
      Risk,
      InitiativeRoles,
    ]),
    AuthModule,
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
