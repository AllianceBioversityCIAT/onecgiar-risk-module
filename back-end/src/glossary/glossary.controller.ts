import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GlossaryService } from './glossary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('glossary')
@Controller('glossary')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class GlossaryController {
    constructor(
        private glossaryService: GlossaryService
      ) {}
      // @Roles(Role.Admin)
      @Get()
       getGlossary(@Query() data: any) {
        try {
          return this.glossaryService.getGlossary(data);
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      // @Roles(Role.Admin)
      @Get(':id')
      getGlossaryById(@Param('id') id: number) {
        try {
          return this.glossaryService.getGlossaryById(id);
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Post('')
      addGlossary(@Body() data: any) {
        try {
          return this.glossaryService.addGlossary(data);
        } catch (error) {
          console.error(error);
        }
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Put(':id')
      updateGlossary(@Body() data: any, @Param('id') id: number) {
        try {
          return this.glossaryService.updateGlossary(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Delete(':id')
      deleteGlossary(@Param('id') id: number) {
        try {
          return this.glossaryService.deleteGlossary(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
