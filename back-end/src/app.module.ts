import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramModule } from './program/program.module';
import { RiskModule } from './risk/risk.module';
import { RiskCategoriesModule } from './risk-categories/risk-categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailsModule } from './emails/emails.module';
import { VariablesModule } from './variables/variables.module';
import { EventsModule } from './events/events.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { MitigationStatusModule } from './mitigation-status/mitigation-status.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesGroupsModule } from './categories-groups/categories-groups.module';
import { GlossaryModule } from './glossary/glossary.module';
import { FaqModule } from './faq/faq.module';
import { PhasesModule } from './phases/phases.module';
import dataSource, { dataSourceOptions } from 'db/data-source';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    RiskModule,
    ProgramModule,
    ScheduleModule.forRoot(),
    EmailsModule,
    RiskCategoriesModule,
    UsersModule,
    VariablesModule,
    EventsModule,
    AnnouncementModule,
    MitigationStatusModule,
    DashboardModule,
    CategoriesGroupsModule,
    GlossaryModule,
    FaqModule,
    PhasesModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
