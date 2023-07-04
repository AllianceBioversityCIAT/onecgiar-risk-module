import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitiativeModule } from './initiative/initiative.module';
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


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      type: 'mysql',
      synchronize: true,
      entities: [`dist/**/*.entity{.ts,.js}`],
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    RiskModule,
    InitiativeModule,
    ScheduleModule.forRoot(),
    EmailsModule,
    RiskCategoriesModule, 
    AuthModule,
    UsersModule,
    VariablesModule,
    EventsModule,
    AnnouncementModule,
    MitigationStatusModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
