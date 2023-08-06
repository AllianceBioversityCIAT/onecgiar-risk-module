import { Module } from '@nestjs/common';
import { GlossaryController } from './glossary.controller';
import { GlossaryService } from './glossary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Glossary } from 'entities/glossary.entity';

@Module({
  controllers: [GlossaryController],
  providers: [GlossaryService],
  imports: [TypeOrmModule.forFeature([Glossary])]
})
export class GlossaryModule {}
