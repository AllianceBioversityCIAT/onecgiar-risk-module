import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@Controller('faq')
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
      @Post('')
      addFaq(@Body() data: any) {
        try {
          return this.FaqService.addFaq(data);
        } catch (error) {
          console.error(error);
        }
      }
      @Put(':id')
      updateFaq(@Body() data: any, @Param('id') id: number) {
        try {
          return this.FaqService.updateFaq(data, id);
        } catch (error) {
          console.error(error);
        }
      }
      @Delete(':id')
      deleteFaq(@Param('id') id: number) {
        try {
          return this.FaqService.deleteFaq(id);
        } catch (error) {
          console.error(error);
        }
      }
    
}
