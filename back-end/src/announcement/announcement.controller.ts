import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { UsersService } from 'src/users/users.service';
import { EmailsService } from 'src/emails/emails.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { cerateAnnouncementReq, cerateAnnouncementRes, sendAnnouncementReq, sendTestReq } from 'DTO/announcement.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
@ApiBearerAuth()
@ApiTags('Announcement')
@Controller('announcement')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class AnnouncementController {
  constructor(
    private announcementService: AnnouncementService,
    private userService: UsersService,
    private emailService: EmailsService,
  ) {}
  //prototype
  @Roles()
  @Get()
  getAnnouncement() {
    try {
      return this.announcementService.getAnnouncement();
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  //
  @Roles()
  @Get('/drafts')
  getAnnouncementDrafts() {
    try {
      return this.announcementService.getAnnouncementDrafts();
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  @Roles()
  @Get('/posted')
  getAnnouncementPosted() {
    try {
      return this.announcementService.getAnnouncementPosted();
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  @Roles()
  @Get(':id')
  getAnnouncementById(@Param('id') id: number) {
    try {
      return this.announcementService.getAnnouncementById(id);
    } catch (error) {
      console.log('ERROR' + error);
    }
  }
  @Roles()
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
  @Roles()
  @Put(':id')
  @ApiBody({ type: cerateAnnouncementReq})
  updateAnnouncement(@Body() data: any, @Param('id') id: number) {
    try {
      return this.announcementService.updateAnnouncement(data, id);
    } catch (error) {
      console.error(error);
    }
  }
  @Roles()
  @Patch(':id')
  updateAnnouncementStatus(@Body() data: any, @Param('id') id: number) {
    try {
      return this.announcementService.updateAnnouncementStatus(data, id);
    } catch (error) {
      console.error(error);
    }
  }
  @Roles()
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
          null,
          null,
          null
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
  @Roles()
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
        null,
        null,
        null
      );
    } catch (error) {
      console.error(error);
    }
  }
  @Roles()
  @Delete(':id')
  deleteAnnouncement(@Param('id') id: number) {
    try {
      return this.announcementService.deleteAnnouncement(id);
    } catch (error) {
      console.error(error);
    }
  }
}
