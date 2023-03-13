import { Test, TestingModule } from '@nestjs/testing';
import { RiskCategoriesService } from './risk-categories.service';

describe('RiskCategoriesService', () => {
  let service: RiskCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskCategoriesService],
    }).compile();

    service = module.get<RiskCategoriesService>(RiskCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
