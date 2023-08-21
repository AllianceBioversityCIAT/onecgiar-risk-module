import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from 'entities/announcement.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  imports: [TypeOrmModule.forFeature([Announcement]),EmailsModule,UsersModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d'},
  })]
})
export class AnnouncementModule {}
