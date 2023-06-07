
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [
    TypeOrmModule.forFeature([Email]),
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
