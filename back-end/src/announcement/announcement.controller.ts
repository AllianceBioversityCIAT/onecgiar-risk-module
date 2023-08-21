import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { UsersService } from 'src/users/users.service';
import { EmailsService } from 'src/emails/emails.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { cerateAnnouncementReq, cerateAnnouncementRes, sendAnnouncementReq, sendTestReq } from 'DTO/announcement.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@ApiTags('announcement')
@Controller('announcement')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementController {
  constructor(
    private announcementService: AnnouncementService,
    private userService: UsersService,
    private emailService: EmailsService,
  ) {}
  @Roles(Role.Admin)
  @Get()
  getAnnouncement() {
    try {
      return this.announcementService.getAnnouncement();
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  @Roles(Role.Admin)
  @Get(':id')
  getAnnouncementById(@Param('id') id: number) {
    try {
      return this.announcementService.getAnnouncementById(id);
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  @Roles(Role.Admin)
  @Post('')
  @ApiCreatedResponse({
    description: '',
    type: cerateAnnouncementRes,
  })
  @ApiBody({ type: cerateAnnouncementReq})
  addAnnouncement(@Body() data: any) {
    try {
      return this.announcementService.addAnnouncement(data);
    } catch (error) {
      console.error(error);
    }
  }
  @Roles(Role.Admin)
  @Put(':id')
  @ApiBody({ type: cerateAnnouncementReq})
  updateAnnouncement(@Body() data: any, @Param('id') id: number) {
    try {
      return this.announcementService.updateAnnouncement(data, id);
    } catch (error) {
      console.error(error);
    }
  }
  @Roles(Role.Admin)
  @Patch(':id')
  updateAnnouncementStatus(@Body() data: any, @Param('id') id: number) {
    try {
      return this.announcementService.updateAnnouncementStatus(data, id);
    } catch (error) {
      console.error(error);
    }
  }
  @Roles(Role.Admin)
  @Post(':id/send')
  @ApiBody({ type: sendAnnouncementReq})
  async Send(@Param('id') id: number) {
    try {
      const announcement = await this.announcementService.getAnnouncementById(
        id,
      );
      const users = await this.userService.userRepository.find();
      const sendon = async (index) => {
        if (!users[index]) return true;
        const user = users[index];

        await this.emailService.createEmailBy(
          user.full_name,
          user.email,
          announcement.subject,
          announcement.description,
        );
        return await sendon(index + 1);
      };
      sendon(0);
      return await this.announcementService.updateAnnouncementStatus(
        announcement,
        id,
      );
    } catch (error) {
      console.error(error);
    }
  }
  @Roles(Role.Admin)
  @Post(':id/send-test')
  @ApiBody({ type: sendTestReq})
  async SendTest(@Body('email') email: any, @Param('id') id: number) {
    try {
      const announcement = await this.announcementService.getAnnouncementById(
        id,
      );

      return await this.emailService.createEmailBy(
        'User Name',
        email,
        announcement.subject + ' ( TEST )',
        announcement.description,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
