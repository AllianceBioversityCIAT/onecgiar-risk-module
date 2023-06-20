import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MitigationStatusService } from './mitigation-status.service';

@Controller('mitigation-status')
export class MitigationStatusController {
    constructor(private MitigationService: MitigationStatusService){}
    @Get()
    getMitigation() {
      try {
        return this.MitigationService.getMitigation();
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Get(':id')
    getMitigationById(@Param('id') id: number) {
      try {
        return this.MitigationService.getMitigationById(id);
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Post('')
    addMitigation(@Body() data: any) {
        try {
            return this.MitigationService.addMitigation(data);
        } catch (error) {
            console.error(error);
        }
    }
    @Put(':id')
    updateMitigation(@Body() data: any, @Param('id') id: number) {
        try {
            return this.MitigationService.updateMitigation(data, id);
        } catch (error) {
            console.error(error);
        }
    }
    @Delete(':id')
    deleteMitigation(@Param('id') id: number) {
        try {
            return this.MitigationService.deleteMitigation(id);
        } catch (error) {
            console.error(error);
        }
    }
}
