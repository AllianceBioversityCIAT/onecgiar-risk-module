import { Test, TestingModule } from '@nestjs/testing';
import { MitigationStatusController } from './mitigation-status.controller';

describe('MitigationStatusController', () => {
  let controller: MitigationStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MitigationStatusController],
    }).compile();

    controller = module.get<MitigationStatusController>(MitigationStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
