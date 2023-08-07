import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FAQ } from 'entities/FAQ.entity';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  imports: [TypeOrmModule.forFeature([FAQ])]
})
export class FaqModule {}
