import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitiativeModule } from './initiative/initiative.module';
import { RiskModule } from './risk/risk.module';
import { RiskCategoriesModule } from './risk-categories/risk-categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
    RiskCategoriesModule, 
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
