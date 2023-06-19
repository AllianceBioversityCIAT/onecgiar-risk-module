import { Body, Controller, Get, Patch } from '@nestjs/common';
import { VariablesService } from './variables.service';

@Controller('variables')
export class VariablesController {
    constructor(private variableService: VariablesService){}
    @Get('system-publish')
    system_publish(){
        return this.variableService.getVariable();
    }
    @Patch('update-system-publish')
    updatePublishValue(@Body() value: string){
        return this.variableService.changeVariable(value);
    }
}
