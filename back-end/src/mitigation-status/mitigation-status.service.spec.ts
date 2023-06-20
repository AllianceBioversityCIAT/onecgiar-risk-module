import { Test, TestingModule } from '@nestjs/testing';
import { MitigationStatusService } from './mitigation-status.service';

describe('MitigationStatusService', () => {
  let service: MitigationStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MitigationStatusService],
    }).compile();

    service = module.get<MitigationStatusService>(MitigationStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
