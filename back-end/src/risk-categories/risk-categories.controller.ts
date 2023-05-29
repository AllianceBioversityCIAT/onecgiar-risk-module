import { Controller, Get } from '@nestjs/common';
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
}
