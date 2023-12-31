import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { ILike } from 'typeorm';

@ApiTags('FAQ')
@Controller('faq')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class FaqController {
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
    constructor(
        private FaqService: FaqService,
      ) {}
      @Get()
      async getFaq(@Query() query) {
        try {
          if(query.page == 'null') {
            return this.FaqService.getFaq();
          } else {
            const take = query.limit || 10;
            const skip = (Number(query.page || 1) - 1) * take;
            let [finalResult,total] = await this.FaqService.FaqRepository.findAndCount({
              where: { question:query?.search ?  ILike(`%${query.search}%`) : null},
              order: { ...this.sort(query) },
              take: take,
              skip: skip,
            });
            return {
              result: finalResult,
              count: total,
            };
          }
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
