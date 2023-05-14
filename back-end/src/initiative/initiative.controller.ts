import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { InitiativeService } from './initiative.service';

@ApiTags('Initiative')
@Controller('initiative')
export class InitiativeController {
  constructor(private iniService: InitiativeService) {}

  @Get()
  @ApiCreatedResponse({
    description: '',
    type: [Initiative],
  })
  getInitiative() {
    return this.iniService.iniRepository.find({
      where:{parent_id:null},
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: '',
    type:Initiative,
  })
  getInitiatives(@Param('id') id: number): Promise<Initiative> {
    return this.iniService.iniRepository.findOne({
      where: { id },
      relations: ['risks', 'risks.categories', 'risks.mitigations',  'roles', 'roles.user'],
    });
  }

  @Post(':id/create_version')
  @ApiCreatedResponse({
    description: '',
    type:Initiative,
  })
  createVersion(@Param('id') id: number): Promise<Initiative> {
    return this.iniService.createINIT(id);
  }

  @Get(':id/versions')
  @ApiCreatedResponse({
    description: '',
    type:Initiative,
  })
  getVersons(@Param('id') id: number) {
     return this.iniService.iniRepository.find({
      where:{parent_id:id},
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }

  @Get(':id/roles')
  @ApiCreatedResponse({
    description: '',
    type:[InitiativeRoles], 
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
    type:[InitiativeRoles],
  })
  @ApiBody({
    type: InitiativeRoles
  })
  @ApiParam({
    name:'initiative_id',
    type:'string'
  })
  setRoles(
    @Param('initiative_id') initiative_id: number,
    @Body() initiativeRoles: InitiativeRoles,
  ) {
    return  this.iniService.setRole(initiative_id,initiativeRoles)
  }

  @Put(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type:InitiativeRoles,
  })
  updateMitigation(
    @Body() roles: InitiativeRoles,
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return  this.iniService.updateRoles(initiative_id,initiative_roles_id,roles)
  }

  @Delete(':initiative_id/roles/:initiative_roles_id')
  @ApiCreatedResponse({
    description: '',
    type:InitiativeRoles,
  })
  deleteRoles(
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return  this.iniService.deleteRole(initiative_id,initiative_roles_id)
  }

 

}
