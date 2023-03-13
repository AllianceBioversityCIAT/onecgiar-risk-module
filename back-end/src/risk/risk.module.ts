import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Risk } from 'entities/risk.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

@Module({
  controllers: [RiskController],
  imports: [TypeOrmModule.forFeature([Risk]), SharedModule],
  providers: [RiskService],
})
export class RiskModule {}
