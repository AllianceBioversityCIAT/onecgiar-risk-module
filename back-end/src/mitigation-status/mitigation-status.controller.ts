import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MitigationStatusService } from './mitigation-status.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Mitigation } from 'entities/mitigation.entity';
import { createMitigationReq, deleteMitigationRes, getMitigation } from 'DTO/mitigation.dto';

@ApiTags('mitigation-status')
@Controller('mitigation-status')
export class MitigationStatusController {
    constructor(private MitigationService: MitigationStatusService){}
    @Get()
    @ApiCreatedResponse({
      description: '',
      type: [getMitigation],
    })
    getMitigation() {
      try {
        return this.MitigationService.getMitigation();
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Get(':id')
    @ApiCreatedResponse({
      description: '',
      type: [getMitigation],
    })
    getMitigationById(@Param('id') id: number) {
      try {
        return this.MitigationService.getMitigationById(id);
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    @Post('')
    @ApiCreatedResponse({
      description: '',
      type: getMitigation,
    })
    @ApiBody({type: createMitigationReq})
    addMitigation(@Body() data: any) {
        try {
            return this.MitigationService.addMitigation(data);
        } catch (error) {
            console.error(error);
        }
    }
    @Put(':id')
    @ApiCreatedResponse({
      description: '',
      type: getMitigation,
    })
    @ApiBody({type: createMitigationReq})
    updateMitigation(@Body() data: any, @Param('id') id: number) {
        try {
            return this.MitigationService.updateMitigation(data, id);
        } catch (error) {
            console.error(error);
        }
    }
    @Delete(':id')
    @ApiCreatedResponse({
      description: '',
      type: deleteMitigationRes,
    })
    deleteMitigation(@Param('id') id: number) {
        try {
            return this.MitigationService.deleteMitigation(id);
        } catch (error) {
            console.error(error);
        }
    }
}
