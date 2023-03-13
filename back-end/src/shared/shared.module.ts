import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entitiy';
import { SharedService } from './shared.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  providers: [SharedService],
  exports: [SharedService, HttpModule],
})
export class SharedModule {}
