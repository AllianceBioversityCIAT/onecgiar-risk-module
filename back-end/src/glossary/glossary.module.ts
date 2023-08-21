import { Module } from '@nestjs/common';
import { GlossaryController } from './glossary.controller';
import { GlossaryService } from './glossary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Glossary } from 'entities/glossary.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  controllers: [GlossaryController],
  providers: [GlossaryService],
  imports: [TypeOrmModule.forFeature([Glossary]),    
    JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d'},
  })]
})
export class GlossaryModule {}
