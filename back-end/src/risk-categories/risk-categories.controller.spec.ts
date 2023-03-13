import { Test, TestingModule } from '@nestjs/testing';
import { RiskCategoriesController } from './risk-categories.controller';

describe('RiskCategoriesController', () => {
  let controller: RiskCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskCategoriesController],
    }).compile();

    controller = module.get<RiskCategoriesController>(RiskCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
