import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { RiskCategory } from 'entities/risk-category.entity';
import { Repository } from 'typeorm';
@ApiTags('Risk Categories')
@Controller('risk-categories')
export class RiskCategoriesController {
  constructor(
    @InjectRepository(RiskCategory)
    public riskcatRepository: Repository<RiskCategory>,
  ) {}
  @ApiCreatedResponse({
    description: '',
    type: [RiskCategory],
  })
  @Get()
  get() {
    return this.riskcatRepository.find({order:{title:'ASC'}});
  }

  @Put()
  updateCategory(@Body() data: any) {
    const category = this.riskcatRepository.create();
    Object.assign(category, data);
    return this.riskcatRepository.save(category, { reload: true });
  }

  @Post()
  async addCategory(@Body() data: any) {
    const category = this.riskcatRepository.create();
    Object.assign(category, data);
    await this.riskcatRepository.save(category, { reload: true });

    return category;
  }

  @Delete(':id')
  deleteCategory(@Param('id') id:number) {
    return this.riskcatRepository.delete(id)
  }
}
