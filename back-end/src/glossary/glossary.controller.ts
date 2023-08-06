import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GlossaryService } from './glossary.service';
@ApiTags('glossary')
@Controller('glossary')
export class GlossaryController {
    constructor(
        private glossaryService: GlossaryService
      ) {}
      @Get()
       getGlossary(@Query() data: any) {
        try {
          return this.glossaryService.getGlossary(data);
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      @Get(':id')
      getGlossaryById(@Param('id') id: number) {
        try {
          return this.glossaryService.getGlossaryById(id);
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      @Post('')
      addGlossary(@Body() data: any) {
        try {
          return this.glossaryService.addGlossary(data);
        } catch (error) {
          console.error(error);
        }
      }
      @Put(':id')
      updateGlossary(@Body() data: any, @Param('id') id: number) {
        try {
          return this.glossaryService.updateGlossary(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @Delete(':id')
      deleteGlossary(@Param('id') id: number) {
        try {
          return this.glossaryService.deleteGlossary(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
