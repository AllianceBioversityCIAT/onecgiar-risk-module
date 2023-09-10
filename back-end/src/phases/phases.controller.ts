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
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Phases')
// @UseGuards(AuthGuard)
@Controller('phases')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @Post()
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }

  @Get()
  findAll() {
    return this.phasesService.findAll();
  }

  @Get('active')
  findActiveOne() {
    return this.phasesService.findActivePhase();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(+id);
  }

  @Get('activate/:id')
  activate(@Param('id') id: string) {
    return this.phasesService.activate(+id);
  }

  @Get('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.phasesService.deactivate(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(+id, updatePhaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phasesService.remove(+id);
  }
}
