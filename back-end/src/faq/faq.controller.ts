import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';

@ApiTags('FAQ')
@Controller('faq')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class FaqController {
    constructor(
        private FaqService: FaqService,
      ) {}
      @Get()
      getFaq() {
        try {
          return this.FaqService.getFaq();
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      @Get(':id')
      getFaqById(@Param('id') id: number) {
        try {
          return this.FaqService.getFaqById(id);
        } catch (error) {
          console.log('ERROR' + error);
        }
      }
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Post('')
      addFaq(@Body() data: any) {
        try {
          return this.FaqService.addFaq(data);
        } catch (error) {
          console.error(error);
        }
      }
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Put(':id')
      updateFaq(@Body() data: any, @Param('id') id: number) {
        try {
          return this.FaqService.updateFaq(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard, AdminRolesGuard)
      @Roles()
      @Delete(':id')
      deleteFaq(@Param('id') id: number) {
        try {
          return this.FaqService.deleteFaq(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
