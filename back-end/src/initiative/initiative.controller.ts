import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { InitiativeService } from './initiative.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'excel4node';
import { join } from 'path';
import { createReadStream } from 'fs';
import { RiskService } from 'src/risk/risk.service';
import { In, IsNull } from 'typeorm';
import { unlink } from 'fs/promises';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@ApiTags('Initiative')
@Controller('initiative')
export class InitiativeController {
  constructor(
    private iniService: InitiativeService,
    private riskService: RiskService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCreatedResponse({
    description: '',
    type: [Initiative],
  })
  getInitiative() {
    return this.iniService.iniRepository.find({
      where: { parent_id: null },
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  async getInitiatives(@Param('id') id: number) {
    let asd = await this.iniService.iniRepository
      .findOneOrFail({
        where: { id },
        relations: [
          'risks',
          'risks.categories',
          'risks.mitigations',
          'roles',
          'roles.user',
        ],
      })
      .catch((d) => {
        throw new NotFoundException();
      });

    return asd;
  }
  @Get('all/excel')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  async exportAlltoExcel() {
    let ininit = await this.iniService.iniRepository.find({
      select: ['id'],
      where: { parent_id: IsNull() },
    });
    const risks = await this.riskService.riskRepository.find({
      where: { initiative_id: In(ininit.map((d) => d.id)) },
      relations: ['initiative', 'categories', 'mitigations'],
    });

    const file_name = 'All-Risks-.xlsx';
    var wb: Workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(risks);
    XLSX.utils.book_append_sheet(wb, ws, 'Risks');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );
    setTimeout(async () => {
      await unlink(join(process.cwd(), 'generated_files', file_name));
    }, 9000);
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });
  }
  @Get(':id/excel')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  async exportExcel(@Param('id') id: number) {
    let init = await this.iniService.iniRepository.findOne({
      where: { id },
      relations: [
        'risks',
        'risks.categories',
        'risks.mitigations',
        'roles',
        'roles.user',
      ],
    });
    const file_name = init.official_code + '-Risks-' + init.id + '.xlsx';
    var wb: Workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(init.risks);
    XLSX.utils.book_append_sheet(wb, ws, 'Risks');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );

    setTimeout(async () => {
      await unlink(join(process.cwd(), 'generated_files', file_name));
    }, 9000);

    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });
  }

  @Post(':id/create_version')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  createVersion(@Param('id') id: number): Promise<Initiative> {
    return this.iniService.createINIT(id);
  }

  @Get(':id/versions')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  getVersons(@Param('id') id: number) {
    return this.iniService.iniRepository.find({
      where: { parent_id: id },
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }

  @Get(':id/roles')
  @ApiCreatedResponse({
    description: '',
    type: [InitiativeRoles],
  })
  getRoles(@Param('id') id: number): Promise<InitiativeRoles[]> {
    return this.iniService.iniRolesRepository.find({
      where: { initiative_id: id },
      relations: [],
    });
  }

  @Post(':initiative_id/roles')
  @ApiCreatedResponse({
    description: '',
    type: [InitiativeRoles],
  })
  @ApiBody({
    type: InitiativeRoles,
  })
  @ApiParam({
    name: 'initiative_id',
    type: 'string',
  })
  setRoles(
    @Param('initiative_id') initiative_id: number,
    @Body() initiativeRoles: InitiativeRoles,
  ) {
    return this.iniService.setRole(initiative_id, initiativeRoles);
  }

  @Put(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type: InitiativeRoles,
  })
  updateMitigation(
    @Body() roles: InitiativeRoles,
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return this.iniService.updateRoles(
      initiative_id,
      initiative_roles_id,
      roles,
    );
  }

  @Delete(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type: InitiativeRoles,
  })
  deleteRoles(
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return this.iniService.deleteRole(initiative_id, initiative_roles_id);
  }
}
