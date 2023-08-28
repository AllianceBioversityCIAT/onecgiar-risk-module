import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

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
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Post('')
      addFaq(@Body() data: any) {
        try {
          return this.FaqService.addFaq(data);
        } catch (error) {
          console.error(error);
        }
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Put(':id')
      updateFaq(@Body() data: any, @Param('id') id: number) {
        try {
          return this.FaqService.updateFaq(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
      @Delete(':id')
      deleteFaq(@Param('id') id: number) {
        try {
          return this.FaqService.deleteFaq(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
