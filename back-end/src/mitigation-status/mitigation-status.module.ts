import { Module } from '@nestjs/common';
import { MitigationStatusController } from './mitigation-status.controller';
import { MitigationStatusService } from './mitigation-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MitigationStatus } from 'entities/mitigation-status.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
@Module({
  controllers: [MitigationStatusController],
  providers: [MitigationStatusService],
  imports: [TypeOrmModule.forFeature([MitigationStatus]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d'},
  })]
})
export class MitigationStatusModule {}
