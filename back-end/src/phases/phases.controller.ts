import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhasesService } from './phases.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Phases')
// @UseGuards(AuthGuard)
@Controller('phases')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}
  @Roles()
  @Post()
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }
  @Roles()
  @Get()
  findAll() {
    return this.phasesService.findAll();
  }
  @Roles()
  @Get('active')
  findActiveOne() {
    return this.phasesService.findActivePhase();
  }
  @Roles()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(+id);
  }
  @Roles()
  @Get('activate/:id')
  activate(@Param('id') id: string) {
    return this.phasesService.activate(+id);
  }
  @Roles()
  @Get('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.phasesService.deactivate(+id);
  }
  @Roles()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(+id, updatePhaseDto);
  }
  @Roles()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phasesService.remove(+id);
  }
}
