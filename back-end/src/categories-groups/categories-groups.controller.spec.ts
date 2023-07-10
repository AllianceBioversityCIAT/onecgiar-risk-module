import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesGroupsController } from './categories-groups.controller';

describe('CategoriesGroupsController', () => {
  let controller: CategoriesGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesGroupsController],
    }).compile();

    controller = module.get<CategoriesGroupsController>(CategoriesGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
