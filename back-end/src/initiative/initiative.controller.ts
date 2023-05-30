import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { InitiativeService } from './initiative.service';
import * as XLSX from 'xlsx';
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
      where: { parent_id: IsNull() },
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
      ],
      order: { id: 'ASC', risks: { id: 'DESC' } },
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
          'risks.category',
          'risks.mitigations',
          'risks.created_by',
          'risks.risk_owner',
          'risks.risk_owner.user',
          'created_by',
          'roles',
          'roles.user',
        ],
        order: { id: 'DESC', risks: { id: 'DESC' } },
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
      relations: ['initiative', 'category', 'mitigations', 'risk_owner'],
    });

    const file_name = 'All-Risks-.xlsx';
    var wb = XLSX.utils.book_new();
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

  @Get(':id/test_excel')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  async testexil(@Param('id') id: number) {
    const workbook = await XLSX.readFile(
      join(process.cwd(), 'generated_files', 'risk.xlsx'),
      { cellStyles: true },
    );

    return workbook;
    // let init = await this.iniService.iniRepository.findOne({
    //   where: { id },
    //   relations: [
    //     'risks',
    //     'risks.category',
    //     'risks.mitigations',
    //     'risks.risk_owner',
    //     'risks.risk_owner.user',
    //     'roles',
    //     'roles.user',
    //   ],
    // });
    // const file_name = init.official_code + '-Risks-' + init.id + '.xlsx';
    // var wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.json_to_sheet(init.risks);
    // XLSX.utils.book_append_sheet(wb, ws, 'Risks');
    // await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    // const file = createReadStream(
    //   join(process.cwd(), 'generated_files', file_name),
    // );

    // setTimeout(async () => {
    //   await unlink(join(process.cwd(), 'generated_files', file_name));
    // }, 9000);

    // return new StreamableFile(file, {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   disposition: `attachment; filename="${file_name}"`,
    // });
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
        'risks.category',
        'risks.created_by',
        'risks.mitigations',
        'risks.risk_owner',
        'risks.risk_owner.user',
        'roles',
        'roles.user',
      ],
    });
    /// merges  Here s = start, r = row, c=col, e= end

    const file_name = init.official_code + '-Risks-' + init.id + '.xlsx';
    var wb = XLSX.utils.book_new();

    const risks = init.risks;

    let finaldata = [
      {
        id: null,
        title: null,
        description: null,
        risk_owner: null,
        target_likelihood: null,
        target_impact: null,
        current_likelihood: null,
        current_impact: null,
        category: null,
        created_by: null,
        redundant: false,
        mitigations: 'Description',
        mitigations_status: 'Status',
      },
    ];
    let merges = [
      {
        s: { c: 11, r: 0 },
        e: { c: 12, r: 0 },
      },
    ];
    for (let index = 0; index < 11; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }
    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = {
        id: null,
        title: null,
        description: null,
        risk_owner: null,
        target_likelihood: null,
        target_impact: null,
        current_likelihood: null,
        current_impact: null,
        category: null,
        created_by: null,
        redundant: false,
        mitigations: null,
        mitigations_status: null,
      };
      template.id = element.id;
      template.title = element.title;
      template.description = element.description;
      template.risk_owner = element.risk_owner?.user?.full_name;
      template.target_likelihood = element.target_likelihood;
      template.target_impact = element.target_impact;
      template.current_likelihood = element.current_likelihood;
      template.current_impact = element.current_impact;
      template.category = element.category.title;
      template.created_by = element.created_by?.full_name;
      template.redundant = element.redundant;
      if (element.mitigations.length) {
        for (let index = 0; index < 11; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length -1 },
          });
        }
        base += element.mitigations.length;
      }else{
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template.mitigations = d.description;
          template.mitigations_status = d.status;
          finaldata.push(template);
        }else{
          const template2 = {
            id: null,
            title: null,
            description: null,
            risk_owner: null,
            target_likelihood: null,
            target_impact: null,
            current_likelihood: null,
            current_impact: null,
            category: null,
            created_by: null,
            redundant: false,
            mitigations: null,
            mitigations_status: null,
          };
          template2.mitigations = d.description;
          template2.mitigations_status = d.status;
          finaldata.push(template2);
        }
      });
    });
    const ws = XLSX.utils.json_to_sheet(finaldata);
    ws['!merges'] = merges;

    XLSX.utils.book_append_sheet(wb, ws, 'Risks2');
    await XLSX.writeFile(
      wb,
      join(process.cwd(), 'generated_files', file_name),
      { cellStyles: true },
    );
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/create_version')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  createVersion(
    @Param('id') id: number,
    @Body('reason') reason: string,
    @Request() req,
  ): Promise<Initiative> {
    return this.iniService.createINIT(id, reason, req.user);
  }

  @Get(':id/versions')
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  getVersons(@Param('id') id: number) {
    return this.iniService.iniRepository.find({
      where: { parent_id: id },
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
        'created_by',
      ],
      order: { id: 'DESC', risks: { id: 'DESC' } },
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
      relations: ['user'],
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
