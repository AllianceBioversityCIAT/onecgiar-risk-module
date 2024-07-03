import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
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
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

import { join } from 'path';
import { createReadStream } from 'fs';
import { RiskService } from 'src/risk/risk.service';
import {
  DataSource,
  ILike,
  In,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  createQueryBuilder,
} from 'typeorm';
import { unlink } from 'fs/promises';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Risk } from 'entities/risk.entity';
import {
  AllExcel,
  TopSimilar,
  createRoleReq,
  createRoleRes,
  createVersion,
  deleteRoleRes,
  getAllCategories,
  getAllVersions,
  getInitiative,
  getInitiativeById,
  getRoles,
  reqBodyCreateVersion,
  updateRoleReq,
  updateRoleRes,
} from 'DTO/initiative.dto';
import { RiskCategory } from 'entities/risk-category.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { OpenGuard } from 'src/auth/open.guard';
import { UsersService } from 'src/users/users.service';
@ApiTags('Initiative')
@Controller('initiative')
export class InitiativeController {
  constructor(
    private iniService: InitiativeService,
    private riskService: RiskService,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}
  @Get('import')
  async import() {
    await this.iniService.syncFromClarisa();
    return 'Initiatives imported successfully';
  }
  offical(query) {
    if (query.initiative_id != null) {
      if (query.initiative_id.charAt(0) == '0') {
        const id = query.initiative_id.substring(1);
        if (id <= 9) {
          return 'INIT-0' + id;
        }
      } else {
        if (query.initiative_id <= 9) {
          return 'INIT-0' + query.initiative_id;
        } else {
          return 'INIT-' + query.initiative_id;
        }
      }
    }
    return query.initiative_id;
  }
  roles(query, req) {
    if (query?.my_role) {
      if (Array.isArray(query?.my_role)) {
        return {
          roles: {
            user_id: req.user.id,
            role: In(query.my_role),
          },
        };
      } else
        return {
          roles: {
            user_id: req.user.id,
            role: query.my_role,
          },
        };
    } else if (query?.my_ini == 'true') {
      return { roles: { user_id: req.user.id } };
    } else return {};
  }
  filterCategory(query, title) {
    if (title == 'For Init') {
      if (query?.category) {
        if (Array.isArray(query?.category)) {
          return {
            category_id: In(query.category),
          };
        } else
          return {
            category_id: query.category,
          };
      } else return {};
    } else {
      if (query?.category) {
        if (Array.isArray(query?.category)) {
          return {
            id: In(query.category),
          };
        } else
          return {
            id: query.category,
          };
      } else return {};
    }
  }
  sort(query, top = false): any {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return top ? { top: 'ASC', id: 'ASC' } : { official_code: 'ASC' };
  }
  @UseGuards(JwtAuthGuard)
  @Get('import-file')
  async importFile() {
    const workbook = XLSX.readFile(
      join(process.cwd(), 'Initiatives all risks.xlsx'),
    );

    const data: any = XLSX.utils.sheet_to_json(workbook.Sheets['2023 Update']);

    for (let row of data) {
      row['Current Impact'] = +row['Current Impact'];
      row['Current Likelihood'] = +row['Current Likelihood'];
      row['code'] = +row['INIT'].replace(/^\D+/g, '');
      row['title'] =
        row[
          'Top 5 risks to achieving impact \r\n(note relevant Work Package numbers in brackets)'
        ];
      row['description'] = row['Description of risk (50 words max each)'];
      if (row['Skip'] != '1') {
        let risk = this.riskService.riskRepository.create();

        risk.description = row['description'];
        risk.current_impact = row['Current Impact'];
        risk.current_likelihood = row['Current Likelihood'];
        risk.target_likelihood = 0;
        risk.target_impact = 0;
        risk.created_by_user_id=1
        risk.title = row['title'];
        if (row['title'].length >= 255) {
          row['title'] = row['title'].trim().substring(0, 254);
          risk.title = row['title'];
        }
        const risk_category = await this.dataSource
          .createQueryBuilder()
          .addFrom(RiskCategory, RiskCategory.name)
          .where({ title: row['New categories mapping'] })
          .execute();
        risk.category_id = risk_category[0].id;

        const initiative = await this.iniService.iniRepository.findOne({
          where: {
            parent_id: IsNull(),
            official_code:
              row.code <= 9 ? `INIT-0${row.code}` : `INIT-${row.code}`,
          },
        });
        risk.initiative_id = initiative.id;
        await this.riskService.riskRepository.save(risk);
      }
    }

    return data;
  }
  @UseGuards(JwtAuthGuard)
  @Get('import-users_roles')
  async importUsersRolesFile() {
    const workbook = XLSX.readFile(join(process.cwd(), 'user_report.xlsx'));

    const data: any = XLSX.utils.sheet_to_json(workbook.Sheets['data']);

    for (let row of data) {
      var code = row['Initiative name'].substring(
        row['Initiative name'].indexOf('(') + 1,
        row['Initiative name'].lastIndexOf(')'),
      );

      let exist_user = await this.userService.findByEmail(row.Email);
      if (!exist_user) {
        const new_user = this.userService.userRepository.create();
        new_user.email = row.Email;
        new_user.first_name = row['First name'];
        new_user.last_name = row['Last name'];
        new_user.role = 'user';
        exist_user = await this.userService.userRepository.save(new_user, {
          reload: true,
        });
      }

      const initiative = await this.iniService.iniRepository.findOne({
        where: {
          parent_id: IsNull(),
          official_code: code,
        },
      });
      if (initiative) {
        const exist_role = await this.iniService.iniRolesRepository.find({
          where: { user_id: exist_user.id, initiative_id: initiative.id },
        });
        if (!exist_role.length) {
          const new_role = this.iniService.iniRolesRepository.create();
          new_role.initiative_id = initiative.id;
          new_role.role = row['Initiative role'];
          new_role.user_id = exist_user.id;
          await this.iniService.iniRolesRepository.save(new_role);
        }
      }
    }
    return data;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCreatedResponse({
    description: '',
    type: [getInitiative],
  })
  async getInitiative(@Query() query: any, @Req() req) { 
    let data = await this.iniService.iniRepository.find({
      where: {
        name: query?.name ? ILike(`%${query.name}%`) : null,
        parent_id: IsNull(),
        official_code: this.offical(query),
        ...this.roles(query, req),
        risks: { ...this.filterCategory(query, 'For Init') },
        // risks: { category_id: query?.category ? In(query?.category) : null },
      },
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
      ],
      order: { ...this.sort(query), risks: { id: 'DESC', top: 'ASC' } },
    });

    const activePhase = await this.iniService.phaseService.findActivePhase();
    if(!query.phase_id)
      query.phase_id = activePhase.id;
    if(activePhase) {
      for(let init of data) {
        const lastVersion = await this.iniService.iniRepository.findOne({
          where: { parent_id: init.id, phase_id: query.phase_id },
          order: { official_code: 'ASC'},
        });
        if(activePhase.id != query.phase_id) {
          if(lastVersion) {
            init['status_by_phase'] = 'submitted';
          } else {
            init['status_by_phase'] = 'draft';
          }
        } else {
          if(lastVersion) {
            if(lastVersion.status) {
              init['status_by_phase'] = 'submitted';
            } else {
              init['status_by_phase'] = 'draft';
            }
          }
          if(!lastVersion) {
            init['status_by_phase'] = 'draft';
          }
        }
      }
    }

    if(query.status) {
      if(query.status == '1') {
        data = data.filter(d => d['status_by_phase'] == 'submitted');
      } else {
        data = data.filter(d => d['status_by_phase'] == 'draft');
      }
    }

    return data;
  } 
  getTemplateAdmin(width = false) {
    return {
      // 'top': null,
      'Risk id': null,
      ID: null,
      Title: null,
      Description: null,
      'Risk owner': null,
      'Current likelihood': null,
      'Current impact': null,
      'Current Risk Level': null,
      'Target likelihood': null,
      'Target impact': null,
      'Target Risk Level': null,

      Category: null,
      'Created by': null,
      'Targets not set': null,
      Flagged: null,
      'Due date': null,
      // Redundant: false,
      'Actions /Controls to manage risks': width ? 'Description' : null,
      mitigations_status: width ? 'Status' : null,
    };
  }

  mapTemplateAdmin(template, element) {
    // template['top'] = element.top == 999 ? '' : element.top;
    template['Risk id'] =
      element.original_risk_id == null ? element.id : element.original_risk_id;
    template.Title = element.title;
    template.ID = element.initiative.official_code;
    template.Description = element.description;
    template['Risk owner'] = element.risk_owner?.user?.full_name;
    template['Current likelihood'] = element.current_likelihood;
    template['Current impact'] = element.current_impact;
    template['Current Risk Level'] =
      element.current_likelihood * element.current_impact;
    template['Target likelihood'] = element.target_likelihood;
    template['Target impact'] = element.target_impact;
    template['Target Risk Level'] =
      element.target_likelihood * element.target_impact;

    template.Category = element.category.title;
    template['Created by'] = element.created_by?.full_name;
    // template.Redundant = element.redundant;
    template['Due date'] =
      element.due_date === null
        ? 'null'
        : new Date(element.due_date).toLocaleDateString();
    template['Flagged'] = element.flag == true ? 'True' : 'False';
    template['Targets not set'] =
      element.request_assistance == true ? 'Yes' : 'No';
  }

  prepareDataExcelAdmin(risks) {
    let finaldata = [this.getTemplateAdmin(true)];
    let merges = [
      {
        s: { c: 16, r: 0 },
        e: { c: 17, r: 0 },
      },
    ];
    for (let index = 0; index < 16; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }
    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = this.getTemplateAdmin();
      this.mapTemplateAdmin(template, element);
      if (element.mitigations.length) {
        for (let index = 0; index < 15; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length - 1 },
          });
        }
        base += element.mitigations.length;
      } else {
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template['Actions /Controls to manage risks'] = d.description;
          template.mitigations_status = d.status.title;
          finaldata.push(template);
        } else {
          const template2 = this.getTemplateAdmin();
          template2['Actions /Controls to manage risks'] = d.description;
          template2.mitigations_status = d.status.title;
          finaldata.push(template2);
        }
      });
    });
    return { finaldata, merges };
  }

  getTemplateAllDataAdmin(width = false) {
    return {
      // 'top': null,
      'Risk id': null,
      ID: null,
      Title: null,
      Description: null,
      'Risk owner': null,
      'Current likelihood': null,
      'Current impact': null,
      'Current Risk Level': null,
      'Target likelihood': null,
      'Target impact': null,
      'Target Risk Level': null,

      Category: null,
      'Created by': null,
      Flagged: null,
      'Due date': null,
      'Targets not set': null,
      // Redundant: false,
      'Actions /Controls to manage risks': width ? 'Description' : null,
      mitigations_status: width ? 'Status' : null,
    };
  }

  mapTemplateAllDataAdmin(template, element) {
    // template['top'] = element.top == 999 ? '' : element.top;

    template['Risk id'] =
      element.original_risk_id == null ? element.id : element.original_risk_id;
    template.Title = element.title;
    template.ID = element.initiative.official_code;
    template.Description = element.description;
    template['Risk owner'] = element.risk_owner?.user?.full_name;
    template['Current likelihood'] = element.current_likelihood;
    template['Current impact'] = element.current_impact;
    template['Current Risk Level'] =
      element.current_likelihood * element.current_impact;
    template['Target likelihood'] = element.target_likelihood;
    template['Target impact'] = element.target_impact;
    template['Target Risk Level'] =
      element.target_likelihood * element.target_impact;

    template.Category = element.category.title;
    template['Created by'] = element.created_by?.full_name;
    // template.Redundant = element.redundant;
    template['Due date'] =
      element.due_date === null
        ? 'null'
        : new Date(element.due_date).toLocaleDateString();
    template['Flagged'] = element.flag == true ? 'True' : 'False';
    template['Targets not set'] =
      element.request_assistance == true ? 'Yes' : 'No';
  }

  prepareAllDataExcelAdmin(risks) {
    let finaldata = [this.getTemplateAllDataAdmin(true)];
    let merges = [
      {
        s: { c: 16, r: 0 },
        e: { c: 17, r: 0 },
      },
    ];
    for (let index = 0; index < 16; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }

    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = this.getTemplateAllDataAdmin();
      this.mapTemplateAllDataAdmin(template, element);
      if (element.mitigations.length) {
        for (let index = 0; index < 15; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length - 1 },
          });
        }
        base += element.mitigations.length;
      } else {
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template['Actions /Controls to manage risks'] = d.description;
          template.mitigations_status = d.status.title;
          finaldata.push(template);
        } else {
          const template2 = this.getTemplateAllDataAdmin();
          template2['Actions /Controls to manage risks'] = d.description;
          template2.mitigations_status = d.status.title;
          finaldata.push(template2);
        }
      });
    });
    return { finaldata, merges };
  }
  getTemplateVersionAdmin(width = false) {
    return {
      top: null,
      'Risk id': null,
      ID: null,
      Title: null,
      Description: null,
      'Risk owner': null,
      'Current likelihood': null,
      'Current impact': null,
      'Current Risk Level': null,
      'Target likelihood': null,
      'Target impact': null,
      'Target Risk Level': null,

      Category: null,
      'Created by': null,
      'Targets not set': null,
      Flagged: null,
      'Due date': null,
      // Redundant: false,
      'Actions /Controls to manage risks': width ? 'Description' : null,
      mitigations_status: width ? 'Status' : null,
    };
  }

  mapTemplateVersionAdmin(template, element) {
    template['top'] = element.top == 999 ? '' : element.top;
    template['Risk id'] =
      element.original_risk_id == null ? element.id : element.original_risk_id;
    template.Title = element.title;
    template.ID = element.initiative.official_code;
    template.Description = element.description;
    template['Risk owner'] = element.risk_owner?.user?.full_name;
    template['Current likelihood'] = element.current_likelihood;
    template['Current impact'] = element.current_impact;
    template['Current Risk Level'] =
      element.current_likelihood * element.current_impact;
    template['Target likelihood'] = element.target_likelihood;
    template['Target impact'] = element.target_impact;
    template['Target Risk Level'] =
      element.target_likelihood * element.target_impact;

    template.Category = element.category.title;
    template['Created by'] = element.created_by?.full_name;
    // template.Redundant = element.redundant;
    template['Due date'] =
      element.due_date === null
        ? 'null'
        : new Date(element.due_date).toLocaleDateString();
    template['Flagged'] = element.flag == true ? 'True' : 'False';
    template['Targets not set'] =
      element.request_assistance == true ? 'Yes' : 'No';
  }

  prepareDataExcelVersionAdmin(risks) {
    let finaldata = [this.getTemplateVersionAdmin(true)];
    let merges = [
      {
        s: { c: 17, r: 0 },
        e: { c: 18, r: 0 },
      },
    ];
    for (let index = 0; index < 17; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }
    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = this.getTemplateVersionAdmin();
      this.mapTemplateVersionAdmin(template, element);
      if (element.mitigations.length) {
        for (let index = 0; index < 15; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length - 1 },
          });
        }
        base += element.mitigations.length;
      } else {
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template['Actions /Controls to manage risks'] = d.description;
          template.mitigations_status = d.status.title;
          finaldata.push(template);
        } else {
          const template2 = this.getTemplateVersionAdmin();
          template2['Actions /Controls to manage risks'] = d.description;
          template2.mitigations_status = d.status.title;
          finaldata.push(template2);
        }
      });
    });
    return { finaldata, merges };
  }

  getTemplateUser(width = false) {
    return {
      'Risk id': null,
      ID: null,
      Title: null,
      Description: null,
      'Risk owner': null,
      'Current likelihood': null,
      'Current impact': null,
      'Current Risk Level': null,
      'Target likelihood': null,
      'Target impact': null,
      'Target Risk Level': null,

      Category: null,
      'Created by': null,
      'Targets not set': null,
      // "Flag to SGD":null,
      'Due Date': null,
      // Redundant: false,
      'Actions /Controls to manage risks': width ? 'Description' : null,
      mitigations_status: width ? 'Status' : null,
    };
  }

  mapTemplateUser(template, element) {
    template['Risk id'] =
      element.original_risk_id == null ? element.id : element.original_risk_id;
    template.Title = element.title;
    template.ID = element.initiative.official_code;
    template.Description = element.description;
    template['Risk owner'] = element.risk_owner?.user?.full_name;
    template['Current likelihood'] = element.current_likelihood;
    template['Current impact'] = element.current_impact;
    template['Current Risk Level'] =
      element.current_likelihood * element.current_impact;
    template['Target likelihood'] = element.target_likelihood;
    template['Target impact'] = element.target_impact;
    template['Target Risk Level'] =
      element.target_likelihood * element.target_impact;

    template.Category = element.category.title;
    template['Created by'] = element.created_by?.full_name;
    template['Due Date'] =
      element.due_date === null
        ? 'null'
        : new Date(element.due_date).toLocaleDateString();
    template['Targets not set'] =
      element.request_assistance == true ? 'Yes' : 'No';
    // template.Redundant = element.redundant;
    // template['Flag to SGD'] = element.flag;
  }

  prepareDataExcelUser(risks) {
    let finaldata = [this.getTemplateUser(true)];
    let merges = [
      {
        s: { c: 15, r: 0 },
        e: { c: 16, r: 0 },
      },
    ];
    for (let index = 0; index < 15; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }

    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = this.getTemplateUser();
      this.mapTemplateUser(template, element);
      if (element.mitigations.length) {
        for (let index = 0; index < 14; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length - 1 },
          });
        }
        base += element.mitigations.length;
      } else {
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template['Actions /Controls to manage risks'] = d.description;
          template.mitigations_status = d.status.title;
          finaldata.push(template);
        } else {
          const template2 = this.getTemplateUser();
          template2['Actions /Controls to manage risks'] = d.description;
          template2.mitigations_status = d.status.title;
          finaldata.push(template2);
        }
      });
    });
    return { finaldata, merges };
  }

  getTemplateVersionUser(width = false) {
    return {
      top: null,
      'Risk id': null,
      ID: null,
      Title: null,
      Description: null,
      'Risk owner': null,
      'Current likelihood': null,
      'Current impact': null,
      'Current Risk Level': null,
      'Target likelihood': null,
      'Target impact': null,
      'Target Risk Level': null,

      Category: null,
      'Created by': null,
      'Targets not set': null,
      // "Flag to SGD":null,
      'Due Date': null,
      // Redundant: false,
      'Actions /Controls to manage risks': width ? 'Description' : null,
      mitigations_status: width ? 'Status' : null,
    };
  }

  mapTemplateVersionUser(template, element) {
    template['top'] = element.top == 999 ? '' : element.top;
    template['Risk id'] =
      element.original_risk_id == null ? element.id : element.original_risk_id;
    template.Title = element.title;
    template.ID = element.initiative.official_code;
    template.Description = element.description;
    template['Risk owner'] = element.risk_owner?.user?.full_name;
    template['Current likelihood'] = element.current_likelihood;
    template['Current impact'] = element.current_impact;
    template['Current Risk Level'] =
      element.current_likelihood * element.current_impact;
    template['Target likelihood'] = element.target_likelihood;
    template['Target impact'] = element.target_impact;
    template['Target Risk Level'] =
      element.target_likelihood * element.target_impact;

    template.Category = element.category.title;
    template['Created by'] = element.created_by?.full_name;
    template['Due Date'] =
      element.due_date === null
        ? 'null'
        : new Date(element.due_date).toLocaleDateString();
    template['Targets not set'] =
      element.request_assistance == true ? 'Yes' : 'No';
    // template.Redundant = element.redundant;
    // template['Flag to SGD'] = element.flag;
  }

  prepareDataExcelVersionUser(risks) {
    let finaldata = [this.getTemplateVersionUser(true)];
    let merges = [
      {
        s: { c: 16, r: 0 },
        e: { c: 17, r: 0 },
      },
    ];
    for (let index = 0; index < 16; index++) {
      merges.push({
        s: { c: index, r: 0 },
        e: { c: index, r: 1 },
      });
    }

    let base = 2;
    risks.forEach((element, indexbase) => {
      const template = this.getTemplateVersionUser();
      this.mapTemplateVersionUser(template, element);
      if (element.mitigations.length) {
        for (let index = 0; index < 15; index++) {
          merges.push({
            s: { c: index, r: base },
            e: { c: index, r: base + element.mitigations.length - 1 },
          });
        }
        base += element.mitigations.length;
      } else {
        finaldata.push(template);
        base += 1;
      }
      element.mitigations.forEach((d, index) => {
        if (index == 0) {
          template['Actions /Controls to manage risks'] = d.description;
          template.mitigations_status = d.status.title;
          finaldata.push(template);
        } else {
          const template2 = this.getTemplateVersionUser();
          template2['Actions /Controls to manage risks'] = d.description;
          template2.mitigations_status = d.status.title;
          finaldata.push(template2);
        }
      });
    });
    return { finaldata, merges };
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiCreatedResponse({
    description: '',
    type: getInitiativeById,
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
        order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
      })
      .catch((d) => {
        throw new NotFoundException();
      });

    return asd;
  }
  @UseGuards(JwtAuthGuard)
  @Get('version/:id')
  @ApiCreatedResponse({
    description: '',
    type: getInitiativeById,
  })
  async getInitiativesForVersion(
    @Param('id') id: number,
    @Query() filters: any,
  ) {
    let result = await this.iniService.iniRepository
      .findOneOrFail({
        where: {
          id,
          risks: {
            redundant: false,
            request_assistance:
              filters?.request_assistance == 'true' ? true : null,
          },
        },
        relations: [
          'risks',
          'risks.category',
          'risks.mitigations',
          'risks.mitigations.status',
          'risks.created_by',
          'risks.risk_owner',
          'risks.risk_owner.user',
          'created_by',
          'roles',
          'roles.user',
        ],
        // order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
        order: { risks: { top: 'ASC' } },
      })
      .catch((d) => {
        throw new BadRequestException('No data matching');
      });

    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get('all/excel')
  @ApiCreatedResponse({
    description: '',
    type: AllExcel,
  })
  async exportAlltoExcel(@Query() query: any, @Req() req) {
    let ininit = await this.iniService.iniRepository.find({
      select: ['id'],
      where: {
        official_code: this.offical(query),
        parent_id: IsNull(),
        ...this.roles(query, req),
        name: query?.name ? ILike(`%${query.name}%`) : null,
      },
    });


    const lastVersionsByPhase = [];

    const activePhase = await this.iniService.phaseService.findActivePhase();
    if(!query.phase_id)
      query.phase_id = activePhase.id;
    if(activePhase) {
      for(let init of ininit) {
        const lastVersion = await this.iniService.iniRepository.findOne({
          where: { parent_id: init.id, phase_id: query.phase_id },
          order: { id: 'DESC'},
        });
        if(activePhase.id != query.phase_id) {
          lastVersionsByPhase.push(lastVersion);
          if(lastVersion) {
            init['status_by_phase'] = 'submitted';
          } else {
            init['status_by_phase'] = 'draft';
          }
        } else {
          if(lastVersion) {
            if(lastVersion.status) {
              init['status_by_phase'] = 'submitted';
            } else {
              init['status_by_phase'] = 'draft';
            }
          }
          if(!lastVersion) {
            init['status_by_phase'] = 'draft';
          }
        }
      }
    }




    if(query.status) {
      if(query.status == '1') {
        ininit = ininit.filter(d => d['status_by_phase'] == 'submitted');
      } else {
        ininit = ininit.filter(d => d['status_by_phase'] == 'draft');
      }
    }

    let risks = [];

    if(activePhase.id == query.phase_id) {
      risks = await this.riskService.riskRepository.find({
        where: {
          initiative_id: In(ininit.map((d) => d.id)),
          redundant: false,
          category: { ...this.filterCategory(query, 'For risk') },
        },
        relations: [
          'initiative',
          'category',
          'created_by',
          'mitigations',
          'mitigations.status',
          'risk_owner',
          'risk_owner.user',
          'initiative.roles',
          'initiative.roles.user',
        ],
        order: { initiative: { ...this.sort(query) } },
      });
    } else {
      const lastVersionsIdsByPhase = lastVersionsByPhase.filter(d => d).map(d => d.id);
      risks = await this.riskService.riskRepository.find({
        where: {
          initiative_id: In(lastVersionsIdsByPhase),
          redundant: false,
          category: { ...this.filterCategory(query, 'For risk') },
        },
        relations: [
          'initiative',
          'category',
          'created_by',
          'mitigations',
          'mitigations.status',
          'risk_owner',
          'risk_owner.user',
          'initiative.roles',
          'initiative.roles.user',
        ],
        order: { initiative: { ...this.sort(query) } },
      });
    }

    if (query.user == 'admin') {
      const file_name = 'All-Risks-.xlsx';
      var wb = XLSX.utils.book_new();
      const { finaldata, merges } = this.prepareAllDataExcelAdmin(risks); 
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;


      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

      XLSX.utils.book_append_sheet(wb, ws, 'Risks');
      await XLSX.writeFile(
        wb,
        join(process.cwd(), 'generated_files', file_name),
        { cellStyles: true },
      );
      const file = createReadStream(
        join(process.cwd(), 'generated_files', file_name),
      );

      setTimeout(async () => {
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);
      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    } else {
      const file_name = 'All-Risks-.xlsx';
      var wb = XLSX.utils.book_new();
      const { finaldata, merges } = this.prepareDataExcelUser(risks);
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;

      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

      XLSX.utils.book_append_sheet(wb, ws, 'Risks');
      await XLSX.writeFile(
        wb,
        join(process.cwd(), 'generated_files', file_name),
        { cellStyles: true },
      );
      const file = createReadStream(
        join(process.cwd(), 'generated_files', file_name),
      );

      setTimeout(async () => {
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);
      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    }
  }

  appendStyleForXlsx(ws: XLSX.WorkSheet) {

    const range = XLSX.utils.decode_range(ws["!ref"] ?? "");
    const rowCount = range.e.r;
    const columnCount = range.e.c;

    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col <= columnCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        // Add center alignment to every cell
        
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
          },
        };


        if (row === 0 || row === 1) {
          // Format headers and names
          ws[cellRef].s = {
            ...ws[cellRef].s,
            fill: { fgColor: { rgb: '436280' } },
            font: { color: { rgb: 'ffffff' } ,  bold: true },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          };
        }
      }
    }
  }

  //#3
  autofitColumnsXlsx(json: any[], worksheet: XLSX.WorkSheet, header?: string[]) {

    const jsonKeys = header ? header : Object.keys(json[0]);

    let objectMaxLength = []; 
    for (let i = 0; i < json.length; i++) {
      let objValue = json[i];
      for (let j = 0; j < jsonKeys.length; j++) {
        if (typeof objValue[jsonKeys[j]] == "number") {
          objectMaxLength[j] = 10;
        } else {
          const l = objValue[jsonKeys[j]] ? objValue[jsonKeys[j]].length : 0;
          if(l > 300) {
            objectMaxLength[j] = 70;
          } else {
            objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j]: l / 3;
          }
        }
      }

      let key = jsonKeys;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] =
          objectMaxLength[j] >= key[j].length
            ? objectMaxLength[j]
            : key[j].length + 10; //for Flagged column
      }
    }

    const wscols = objectMaxLength.map(w => { return { width: w} });

    //row height
    worksheet['!rows'] = [];
    worksheet['!rows'].push({ //for header
      hpt: 40
     })
     worksheet['!rows'].push({ //for header
      hpt: 40
     })
    for(let i = 1 ; i <= json.length -1 ; i++) {
      if(json[i]) {
        if(json[i]['Actions /Controls to manage risks'] && json[i].Description) {
          if(json[i]['Actions /Controls to manage risks'].length > 300  || json[i].Description.length > 300) {
            worksheet['!rows'].push({
              hpt: json[i]['Actions /Controls to manage risks'].length > json[i].Description.length ?  json[i]['Actions /Controls to manage risks'].length / 3 : json[i].Description.length / 3
             })
          } 
          else {
            worksheet['!rows'].push({
              hpt: 100
             })
          }
        } else if(json[i]['Actions /Controls to manage risks'] && json[i].Description == null) {
          if(json[i]['Actions /Controls to manage risks'].length > 300) {
            worksheet['!rows'].push({
              hpt: json[i]['Actions /Controls to manage risks'].length / 3
            })
          } else {
            worksheet['!rows'].push({
              hpt: 100
             })
          }
        } else if(json[i].Description && json[i]['Actions /Controls to manage risks'] == null) {
          if(json[i].Description.length > 300) {
            worksheet['!rows'].push({
              hpt: json[i].Description.length / 3
            })
          }          else {
            worksheet['!rows'].push({
              hpt: 100
             })
          }
        }
      }
    }

    worksheet["!cols"] = wscols;
  }





  @UseGuards(JwtAuthGuard)
  @Get(':id/excel')
  @ApiCreatedResponse({
    description: '',
    type: getInitiativeById,
  })
  async exportExcel(@Param('id') id: number, @Query() req: any) {
    let init = await this.iniService.iniRepository.findOne({
      where: {
        id: id,
        risks: {
          redundant: req?.redundant == 'true' ? null : false,
          title: req?.title ? ILike(`%${req.title}%`) : null,
          category: { ...this.filterCategory(req, 'For risk') },
          // category: { id: req?.category ? In(req?.category) : null },
          created_by_user_id: req?.created_by
            ? Array.isArray(req?.created_by)
              ? In(req?.created_by)
              : req?.created_by
            : null,
          risk_owner_id: req?.owner
            ? Array.isArray(req?.owner)
              ? In(req?.owner)
              : req?.owner
            : null,
          request_assistance: req?.request_assistance == 'true' ? true : null,
        },
      },
      relations: [
        'risks',
        'risks.category',
        'risks.created_by',
        'risks.mitigations',
        'risks.mitigations.status',
        'risks.risk_owner',
        'risks.risk_owner.user',
        'roles',
        'roles.user',
        'risks.initiative',
      ],
      order: { risks: { ...this.sort(req, req.version == 'true') } },
    });
    /// merges  Here s = start, r = row, c=col, e= end

    const file_name = init.official_code + '-Risks-' + init.id + '.xlsx';
    var wb = XLSX.utils.book_new();

    const risks = init.risks;

    if (req.user == 'admin' && req.version == 'false') {
      const { finaldata, merges } = this.prepareDataExcelAdmin(risks);
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;

      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

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
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);

      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    } else if (req.user == 'admin' && req.version == 'true') {
      const { finaldata, merges } = this.prepareDataExcelVersionAdmin(risks);
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;

      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

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
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);

      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    } else if (req.user == 'user' && req.version == 'false') {
      const { finaldata, merges } = this.prepareDataExcelUser(risks);
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;

      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

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
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);

      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    } else if (req.user == 'user' && req.version == 'true') {
      const { finaldata, merges } = this.prepareDataExcelVersionUser(risks);
      const ws = XLSX.utils.json_to_sheet(finaldata);
      ws['!merges'] = merges;

      this.appendStyleForXlsx(ws);

      this.autofitColumnsXlsx(finaldata,ws);

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
        try {
          await unlink(join(process.cwd(), 'generated_files', file_name));
        } catch (e) {}
      }, 9000);

      return new StreamableFile(file, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${file_name}"`,
      });
    }
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':initiative_id/create_version')
  @ApiCreatedResponse({
    description: '',
    type: createVersion,
  })
  @ApiBody({ type: reqBodyCreateVersion })
  createVersion(
    @Param('initiative_id') id: number,
    @Body('top') top: any,
    @Req() req,
  ): Promise<Initiative> {
    return this.iniService.createINIT(id, req.user, top);
  }
  @UseGuards(JwtAuthGuard)
  @Get('all/categories')
  @ApiCreatedResponse({
    description: '',
    type: getAllCategories,
  })
  getAllCategories() {
    return this.dataSource
      .createQueryBuilder()
      .from('initiative', 'initiative')
      .where('initiative.parent_id IS NULL')
      .distinct(true)
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect('risk_category.description', 'description')
      .addSelect('risk_category.disabled', 'disabled')
      .innerJoin('risk', 'risk', 'initiative.id = risk.initiative_id')
      .innerJoin(
        'risk_category',
        'risk_category',
        'risk_category.id = risk.category_id',
      )
      .orderBy('risk_category.title', 'ASC')
      .execute();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/categories')
  @ApiCreatedResponse({
    description: '',
    type: getAllCategories,
  })
  getCategories(@Param('id') id: number) {
    return this.dataSource
      .createQueryBuilder()
      .from('initiative', 'initiative')
      .distinct(true)
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect('risk_category.description', 'description')
      .addSelect('risk_category.disabled', 'disabled')
      .innerJoin('risk', 'risk', 'initiative.id = risk.initiative_id')
      .innerJoin(
        'risk_category',
        'risk_category',
        'risk_category.id = risk.category_id',
      )
      .where('initiative.id = :id', { id })
      .orderBy('risk_category.title', 'ASC')
      .execute();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/versions')
  @ApiCreatedResponse({
    description: '',
    type: [getAllVersions],
  })
  getVersons(@Param('id') id: number) {
    return this.iniService.iniRepository.find({
      where: { parent_id: id, risks: { redundant: false } },
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
        'created_by',
        'phase',
      ],
      order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/versions/latest')
  @ApiCreatedResponse({
    description: '',
    type: getAllVersions,
  })
  async getLatestVersons(@Param('id') id: number) {
    const phase = await this.iniService.phaseService.findActivePhase();
    return this.iniService.iniRepository.findOne({
      where: { parent_id: id , phase_id: phase.id},
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
        'created_by',
      ],
      order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
    });
  }

  @Get(['report/:official_code', 'report/:official_code/:phase_id'])
  @ApiCreatedResponse({
    description: '',
    type: getAllVersions,
  })
  getLatestVersonsByPhase(
    @Param('official_code') official_code: string,
    @Param('phase_id') phase_id: number,
  ) {
    return this.iniService.iniRepository.findOne({
      where: { official_code, phase_id },
      relations: [
        'risks',
        'action_area',
        'phase',
        'created_by',
        'risks.category',
        'risks.category.category_group',
        'risks.mitigations',
        'risks.mitigations.status',
        'risks.created_by',
        'risks.created_by',
        'risks.risk_owner',
        'risks.risk_owner.user',
        'roles',
        'roles.user',
      ],
      order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/roles')
  @ApiCreatedResponse({
    description: '',
    type: [getRoles],
  })
  getRoles(@Param('id') id: number): Promise<InitiativeRoles[]> {
    return this.iniService.iniRolesRepository.find({
      where: { initiative_id: id },
      relations: ['user'],
    });
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':initiative_id/roles')
  @ApiCreatedResponse({
    description: '',
    type: createRoleRes,
  })
  @ApiBody({
    type: createRoleReq,
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
  @UseGuards(JwtAuthGuard)
  @Put(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type: updateRoleRes,
  })
  @ApiBody({
    type: updateRoleReq,
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
  @UseGuards(JwtAuthGuard)
  @Delete(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type: deleteRoleRes,
  })
  deleteRoles(
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return this.iniService.deleteRole(initiative_id, initiative_roles_id);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/top')
  @ApiCreatedResponse({
    description: '',
    type: TopSimilar,
  })
  async top(@Param('id') id: number) {
    const top_5 = await this.riskService.riskRepository.find({
      where: { initiative_id: id, redundant: false },
      order: { current_level: 'DESC' },
      take: 5,
    });

    const current_impact = top_5.map((d) => d.current_level);
    const current_ids = top_5.map((d) => d.id);

    const similar = await this.riskService.riskRepository.find({
      where: {
        initiative_id: id,
        current_level: In(current_impact),
        id: Not(In(current_ids)),
        redundant: false,
      },
      order: { current_level: 'DESC' },
      take: 5,
    });
    // const top_5 = all_risks.slice(0,4)
    const similar1 = [
      ...similar,
      ...top_5.filter((d) =>
        similar.map((d) => d.current_level).includes(d.current_level),
      ),
    ];

    const top = await this.riskService.riskRepository.find({
      where: {
        initiative_id: id,
        id: Not(In(similar1.map((d) => d.id))),
        current_level: MoreThan(similar1[0] ? similar1[0].current_level : 0),
        redundant: false,
      },
      order: { current_level: 'DESC' },
      take: 5,
    });
    return { top, similar: similar1 };
  }
}
