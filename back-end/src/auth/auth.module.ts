import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { AwsStrategy } from './aws.strategy';
import { HttpModule } from '@nestjs/axios';
import { AdminRolesGuard } from './admin-roles.guard';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d'},
    }),
  ],
  providers: [AuthService, LocalStrategy,AwsStrategy, JwtStrategy, RolesGuard, AdminRolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard]
})
export class AuthModule {}
