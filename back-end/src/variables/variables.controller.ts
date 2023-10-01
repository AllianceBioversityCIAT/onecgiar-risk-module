import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { filterStatusReq } from 'DTO/emails.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Variables')
@Controller('variables')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class VariablesController {
    constructor(private variableService: VariablesService){}
    @ApiBearerAuth()
    // @Roles()
    @Get('')
    getConstants(){
        return this.variableService.getConstants();
    }
    @ApiBearerAuth()
    // @Roles()
    @Get('system-publish')
    system_publish(){
        return this.variableService.getVariable();
    }
    @ApiBearerAuth()
    @Roles()
    @ApiBody({ type: filterStatusReq })
    @Patch('update-system-publish')
    updatePublishValue(@Body() value: string){
        return this.variableService.changeVariable(value);
    }
    @ApiBearerAuth()
    @Roles()
    @Put()
    editConstant(@Body() data:any) {
        return this.variableService.editConstant(data);
    }
}
