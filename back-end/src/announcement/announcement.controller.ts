import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
@Controller('announcement')
export class AnnouncementController {
    constructor(private announcementService: AnnouncementService){}
    @Get()
    getAnnouncement() {
      try {
        return this.announcementService.getAnnouncement();
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Get(':id')
    getAnnouncementById(@Param('id') id: number) {
      try {
        return this.announcementService.getAnnouncementById(id);
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Post('')
    addAnnouncement(@Body() data: any) {
        try {
            return this.announcementService.addAnnouncement(data);
        } catch (error) {
            console.error(error);
        }
    }
    @Put(':id')
    updateAnnouncement(@Body() data: any, @Param('id') id: number) {
        try {
            return this.announcementService.updateAnnouncement(data, id);
        } catch (error) {
            console.error(error);
        }
    }
    @Patch(':id')
    updateAnnouncementStatus(@Body() data: any, @Param('id') id: number) {
        try {
            return this.announcementService.updateAnnouncementStatus(data, id);
        } catch (error) {
            console.error(error);
        }
    }
}
