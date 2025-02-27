import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PhasesService } from './phases.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ILike } from 'typeorm';

@ApiBearerAuth()
@ApiTags('Phases')
@Controller('phases')
export class PhasesController {
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
  constructor(private readonly phasesService: PhasesService) {}
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Post()
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }
  // @Roles()
  @Get()
  async findAll(@Query() query) {
    if(query.page == 'null') {
      return this.phasesService.findAll();
    } else {
      const take = query.limit || 10;
      const skip = (Number(query.page || 1) - 1) * take;
      let [finalResult,total] = await this.phasesService.phaseRepository.findAndCount({
        where: { name:query?.name ?  ILike(`%${query.name}%`) : null},
        relations: ['previous_phase'],
        order: { ...this.sort(query) },
        take: take,
        skip: skip,
      });
      return {
        result: finalResult,
        count: total,
      };
    }
  }
  // @Roles()
  @Get('active')
  findActiveOne() {
    return this.phasesService.findActivePhase();
  }
  @Roles()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Get('activate/:id')
  activate(@Param('id') id: string) {
    return this.phasesService.activate(+id);
  }
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Get('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.phasesService.deactivate(+id);
  }
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(+id, updatePhaseDto);
  }
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phasesService.remove(+id);
  }
  @UseGuards(JwtAuthGuard, AdminRolesGuard)
  @Roles()
  @Get('lastsubmitionversion/:id')
  getLastSubmitionVersionByPhase(@Param('id') id: string) {
    return this.phasesService.getInitVersion(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles()
  @Get('active')
  getActivePhase() {
    return this.phasesService.getActivePhase();
  }
}
