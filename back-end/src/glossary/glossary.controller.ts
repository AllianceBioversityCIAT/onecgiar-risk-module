import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GlossaryService } from './glossary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
@ApiTags('Glossary')
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
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Post('')
      addGlossary(@Body() data: any) {
        try {
          return this.glossaryService.addGlossary(data);
        } catch (error) {
          console.error(error);
        }
      }
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Put(':id')
      updateGlossary(@Body() data: any, @Param('id') id: number) {
        try {
          return this.glossaryService.updateGlossary(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Delete(':id')
      deleteGlossary(@Param('id') id: number) {
        try {
          return this.glossaryService.deleteGlossary(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
