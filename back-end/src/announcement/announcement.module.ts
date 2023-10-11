import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from 'entities/announcement.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  imports: [TypeOrmModule.forFeature([Announcement]),EmailsModule,UsersModule,
  AuthModule]
})
export class AnnouncementModule {}
