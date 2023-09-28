import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MitigationStatusService } from './mitigation-status.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Mitigation } from 'entities/mitigation.entity';
import { createMitigationReq, deleteMitigationRes, getMitigation } from 'DTO/mitigation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { ILike } from 'typeorm';
@ApiBearerAuth()
@ApiTags('Mitigation-status')
@Controller('mitigation-status')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class MitigationStatusController {
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
    constructor(private MitigationService: MitigationStatusService){}
    // @Roles(Role.Admin)
    @Get()
    @ApiCreatedResponse({
      description: '',
      type: [getMitigation],
    })
    async getMitigation(@Query() query) {
      try {
        if(query.page == 'null') {
          return this.MitigationService.getMitigation();
        } else {
          const take = query.limit || 10;
          const skip = (Number(query.page) - 1) * take;
          let [finalResult,total] = await this.MitigationService.MitigationRepository.findAndCount({
            where: { title:query?.title ?  ILike(`%${query.title}%`) : null},
            order: { ...this.sort(query) },
            take: take,
            skip: skip,
          });
          return {
            result: finalResult,
            count: total,
          };
        }
      } catch (error) {
        console.log('ERROR' + error);
      }
    }
    // @Roles(Role.Admin)
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
    @Roles()
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
    @Roles()
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
    @Roles()
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
