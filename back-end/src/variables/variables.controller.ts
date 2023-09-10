import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { filterStatusReq } from 'DTO/emails.dto';

@ApiTags('variables')
@Controller('variables')
export class VariablesController {
    constructor(private variableService: VariablesService){}
    @Get('')
    getConstants(){
        return this.variableService.getConstants();
    }
    @Get('system-publish')
    system_publish(){
        return this.variableService.getVariable();
    }
    @ApiBody({ type: filterStatusReq })
    @Patch('update-system-publish')
    updatePublishValue(@Body() value: string){
        return this.variableService.changeVariable(value);
    }
    @Put()
    editConstant(@Body() data:any) {
        return this.variableService.editConstant(data);
    }
}
